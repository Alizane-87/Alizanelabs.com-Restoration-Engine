import "./helpers/env";

import type OpenAI from "openai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setOpenAIClient } from "@/lib/extraction/extract";
import { ghlOnboardingWebhookSchema } from "@/lib/schemas/ghl";
import type { StagingRecord } from "@/lib/staging/record";
import { buildFacts } from "./helpers/facts";

const staged: StagingRecord[] = [];
const stageRecord = vi.fn(async (record: StagingRecord) => {
  staged.push(record);
  return { sinks: [{ name: "google_sheets", ok: true }] };
});

vi.mock("@/lib/staging/stage", () => ({ stageRecord: (record: StagingRecord) => stageRecord(record) }));

const { processOnboarding } = await import("@/lib/pipeline/processOnboarding");

const payload = ghlOnboardingWebhookSchema.parse({
  eventId: "evt_1",
  contactId: "c_1",
  locationId: "loc_1",
  companyName: "Al Nahda Plumbing",
  tier: "Offer 2",
  country: "AE",
  recordingUrl: "https://recordings.test/call_1.mp3",
  transcript: [
    { role: "agent", text: "What are your hours?" },
    { role: "client", text: "Eight to six." },
  ],
});

beforeEach(() => {
  staged.length = 0;
  stageRecord.mockClear();
});

afterEach(() => setOpenAIClient(null));

function stubClient(behaviour: { content?: unknown; error?: Error }) {
  const create = behaviour.error
    ? vi.fn().mockRejectedValue(behaviour.error)
    : vi.fn().mockResolvedValue({
        model: "gpt-4o-mini",
        choices: [{ message: { content: JSON.stringify(behaviour.content) } }],
        usage: { prompt_tokens: 10, completion_tokens: 5 },
      });
  setOpenAIClient({ chat: { completions: { create } } } as unknown as OpenAI);
}

describe("processOnboarding", () => {
  it("stages an extracted interview as PENDING_REVIEW with CRM identifiers attached", async () => {
    stubClient({ content: buildFacts() });
    const record = await processOnboarding(payload);

    expect(record.status).toBe("PENDING_REVIEW");
    expect(record.recordId).toMatch(/^stg_/);
    expect(record).toMatchObject({
      businessName: "Al Nahda Plumbing",
      ghlEventId: "evt_1",
      ghlContactId: "c_1",
      ghlLocationId: "loc_1",
      tier: "Offer 2",
      recordingUrl: "https://recordings.test/call_1.mp3",
    });
    expect(record.facts?.topServices[0]?.name).toBe("Leak repair");
    expect(staged).toHaveLength(1);
  });

  it("still stages the interview when extraction fails, so nothing is silently lost", async () => {
    stubClient({ error: new Error("503 model overloaded") });
    const record = await processOnboarding(payload);

    expect(record.status).toBe("EXTRACTION_FAILED");
    expect(record.facts).toBeNull();
    expect(record.failureReason).toContain("LLM request failed");
    expect(record.reviewFlags[0]).toMatchObject({ code: "extraction_failed", severity: "high" });
    expect(stageRecord).toHaveBeenCalledTimes(1);
  });
});
