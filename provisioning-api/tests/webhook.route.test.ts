import "./helpers/env";

import { createHmac } from "crypto";
import type { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetKv } from "@/lib/kv";
import { TEST_WEBHOOK_SECRET } from "./helpers/env";

const deferred: Promise<unknown>[] = [];

vi.mock("next/server", () => ({
  after: (callback: () => Promise<unknown>) => {
    deferred.push(callback());
  },
}));

const processOnboarding = vi.fn().mockResolvedValue(undefined);
vi.mock("@/lib/pipeline/processOnboarding", () => ({
  processOnboarding: (payload: unknown) => processOnboarding(payload),
}));

const { GET, POST } = await import("@/app/api/webhooks/ghl/onboarding-complete/route");

const validPayload = {
  eventId: "evt_1",
  contactId: "c_1",
  businessName: "Acme HVAC",
  transcript: "agent: what are your hours?\nclient: eight to six, closed Sunday",
};

function buildRequest(body: unknown, options: { signature?: string; secret?: string } = {}): NextRequest {
  const rawBody = typeof body === "string" ? body : JSON.stringify(body);
  const signature =
    options.signature ??
    createHmac("sha256", options.secret ?? TEST_WEBHOOK_SECRET).update(rawBody, "utf8").digest("hex");

  return new Request("https://provisioning.test/api/webhooks/ghl/onboarding-complete", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-ghl-signature": signature,
      "x-forwarded-for": "203.0.113.9",
    },
    body: rawBody,
  }) as unknown as NextRequest;
}

async function settleDeferred(): Promise<void> {
  await Promise.allSettled(deferred);
  deferred.length = 0;
}

beforeEach(() => {
  resetKv();
  processOnboarding.mockClear();
});

afterEach(async () => {
  await settleDeferred();
});

describe("POST /api/webhooks/ghl/onboarding-complete", () => {
  it("acknowledges with 202 and processes the interview outside the request", async () => {
    const response = await POST(buildRequest(validPayload));

    expect(response.status).toBe(202);
    await expect(response.json()).resolves.toEqual({ status: "accepted", eventId: "evt_1" });

    await settleDeferred();
    expect(processOnboarding).toHaveBeenCalledTimes(1);
    expect(processOnboarding.mock.calls[0]![0]).toMatchObject({ businessName: "Acme HVAC" });
  });

  it("rejects a body signed with the wrong secret, and one with no signature", async () => {
    const wrongSecret = await POST(buildRequest(validPayload, { secret: "attacker-secret" }));
    expect(wrongSecret.status).toBe(401);

    const unsigned = new Request("https://provisioning.test/api/webhooks/ghl/onboarding-complete", {
      method: "POST",
      body: JSON.stringify(validPayload),
    }) as unknown as NextRequest;
    expect((await POST(unsigned)).status).toBe(401);

    expect(processOnboarding).not.toHaveBeenCalled();
  });

  it("ignores a redelivery of the same event", async () => {
    expect((await POST(buildRequest(validPayload))).status).toBe(202);
    const duplicate = await POST(buildRequest(validPayload));

    expect(duplicate.status).toBe(200);
    await expect(duplicate.json()).resolves.toEqual({ status: "duplicate_ignored", eventId: "evt_1" });

    await settleDeferred();
    expect(processOnboarding).toHaveBeenCalledTimes(1);
  });

  it("releases the idempotency claim when processing fails, so the retry is not dropped", async () => {
    processOnboarding.mockRejectedValueOnce(new Error("All staging sinks failed"));

    expect((await POST(buildRequest(validPayload))).status).toBe(202);
    await settleDeferred();

    const retry = await POST(buildRequest(validPayload));
    expect(retry.status).toBe(202);
    await settleDeferred();
    expect(processOnboarding).toHaveBeenCalledTimes(2);
  });

  it("rejects malformed JSON and a payload with no transcript", async () => {
    expect((await POST(buildRequest("{not json"))).status).toBe(400);
    expect((await POST(buildRequest({ eventId: "evt_2", contactId: "c_2" }))).status).toBe(422);
    expect(processOnboarding).not.toHaveBeenCalled();
  });

  it("rejects an oversized body before spending an LLM call", async () => {
    const huge = { eventId: "evt_3", transcript: "a".repeat(1_000_001) };
    expect((await POST(buildRequest(huge))).status).toBe(413);
    expect(processOnboarding).not.toHaveBeenCalled();
  });

  it("rate limits a flood of deliveries from one source", async () => {
    const statuses: number[] = [];
    for (let index = 0; index < 122; index += 1) {
      const response = await POST(buildRequest({ ...validPayload, eventId: `evt_flood_${index}` }));
      statuses.push(response.status);
    }
    expect(statuses.filter((status) => status === 429).length).toBe(2);
  });

  it("still stops a flood that rotates the caller-controlled forwarded-for header", async () => {
    let accepted = 0;
    for (let index = 0; index < 320; index += 1) {
      const request = buildRequest({ ...validPayload, eventId: `evt_spoof_${index}` });
      request.headers.set("x-forwarded-for", `198.51.100.${index % 256}`);
      if ((await POST(request)).status === 202) accepted += 1;
    }
    expect(accepted).toBe(300);
  });

  it("does not accept GET", async () => {
    expect(GET().status).toBe(405);
  });
});
