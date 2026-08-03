import "./helpers/env";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { STAGING_COLUMNS } from "@/lib/staging/record";
import { TEST_APPROVAL_TOKEN } from "./helpers/env";
import { buildFacts } from "./helpers/facts";

const findStagingRow = vi.fn();
const updateStagingStatus = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/staging/sheets", () => ({
  findStagingRow: (recordId: string) => findStagingRow(recordId),
  updateStagingStatus: (options: unknown) => updateStagingStatus(options),
}));

const { POST } = await import("@/app/api/staging/[recordId]/approve/route");

function row(overrides: { status?: string; highSeverityFlagCount?: string; factsJson?: string } = {}) {
  const values = STAGING_COLUMNS.map((column) => {
    if (column === "recordId") return "stg_1";
    if (column === "status") return overrides.status ?? "PENDING_REVIEW";
    if (column === "highSeverityFlagCount") return overrides.highSeverityFlagCount ?? "0";
    if (column === "factsJson") return overrides.factsJson ?? JSON.stringify(buildFacts());
    return "";
  });
  return { rowNumber: 4, values, status: overrides.status ?? "PENDING_REVIEW" };
}

function request(body: unknown, token: string | null = TEST_APPROVAL_TOKEN): Request {
  return new Request("https://provisioning.test/api/staging/stg_1/approve", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

const params = { params: Promise.resolve({ recordId: "stg_1" }) };

beforeEach(() => {
  findStagingRow.mockReset();
  updateStagingStatus.mockClear();
});

describe("POST /api/staging/[recordId]/approve", () => {
  it("requires the internal bearer token", async () => {
    expect((await POST(request({ approvedBy: "ceo" }, null), params)).status).toBe(401);
    expect((await POST(request({ approvedBy: "ceo" }, "wrong-token"), params)).status).toBe(401);
    expect(findStagingRow).not.toHaveBeenCalled();
  });

  it("approves a clean record and returns the verified facts without publishing", async () => {
    findStagingRow.mockResolvedValue(row());
    const response = await POST(request({ approvedBy: "ceo@alizanelabs.site" }), params);
    const body = (await response.json()) as {
      status: string;
      facts: { businessName: string };
      publish: { performed: boolean };
    };

    expect(response.status).toBe(200);
    expect(body.status).toBe("APPROVED");
    expect(body.facts.businessName).toBe("Al Nahda Plumbing");
    expect(body.publish.performed).toBe(false);
    expect(updateStagingStatus).toHaveBeenCalledWith(
      expect.objectContaining({ rowNumber: 4, status: "APPROVED", approvedBy: "ceo@alizanelabs.site" }),
    );
  });

  it("blocks approval of a record with high-severity flags until they are acknowledged", async () => {
    findStagingRow.mockResolvedValue(row({ highSeverityFlagCount: "2" }));

    const blocked = await POST(request({ approvedBy: "ceo" }), params);
    expect(blocked.status).toBe(409);
    await expect(blocked.json()).resolves.toMatchObject({
      error: "high_severity_flags_present",
      highSeverityFlagCount: 2,
    });
    expect(updateStagingStatus).not.toHaveBeenCalled();

    const acknowledged = await POST(request({ approvedBy: "ceo", acknowledgeFlags: true }), params);
    expect(acknowledged.status).toBe(200);
    expect(updateStagingStatus).toHaveBeenCalledTimes(1);
  });

  it("refuses to re-approve, and 404s an unknown record", async () => {
    findStagingRow.mockResolvedValue(row({ status: "APPROVED" }));
    const conflict = await POST(request({ approvedBy: "ceo" }), params);
    expect(conflict.status).toBe(409);
    await expect(conflict.json()).resolves.toMatchObject({ error: "invalid_status", status: "APPROVED" });

    findStagingRow.mockResolvedValue(null);
    expect((await POST(request({ approvedBy: "ceo" }), params)).status).toBe(404);
    expect(updateStagingStatus).not.toHaveBeenCalled();
  });

  it("rejects a body with no reviewer identity", async () => {
    findStagingRow.mockResolvedValue(row());
    expect((await POST(request({}), params)).status).toBe(422);
    expect(updateStagingStatus).not.toHaveBeenCalled();
  });
});
