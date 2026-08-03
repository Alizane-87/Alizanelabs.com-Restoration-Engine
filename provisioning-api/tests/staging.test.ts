import "./helpers/env";

import { afterEach, describe, expect, it, vi } from "vitest";

import { logger, redact } from "@/lib/logger";
import { STAGING_COLUMNS, newRecordId, recordToRow, type StagingRecord } from "@/lib/staging/record";
import { stageRecord } from "@/lib/staging/stage";
import { buildFacts } from "./helpers/facts";

vi.mock("@/lib/staging/sheets", () => ({
  appendStagingRow: (record: StagingRecord) => appendStagingRow(record),
}));
vi.mock("@/lib/staging/slack", () => ({ notifySlack: (record: StagingRecord) => notifySlack(record) }));

const appendStagingRow = vi.fn().mockResolvedValue(undefined);
const notifySlack = vi.fn().mockResolvedValue(undefined);

function buildRecord(overrides: Partial<StagingRecord> = {}): StagingRecord {
  return {
    recordId: newRecordId(),
    receivedAt: "2026-08-02T10:00:00.000Z",
    status: "PENDING_REVIEW",
    businessName: "Al Nahda Plumbing",
    contactName: "Sara",
    email: "sara@example.com",
    phone: "+971500000000",
    tier: "Offer 2",
    country: "AE",
    ghlEventId: "evt_1",
    ghlContactId: "c_1",
    ghlLocationId: "loc_1",
    model: "gpt-4o-mini",
    transcriptChars: 1200,
    recordingUrl: null,
    reviewFlags: [{ code: "price_without_quote", message: "check price", severity: "high" }],
    facts: buildFacts(),
    failureReason: null,
    ...overrides,
  };
}

afterEach(() => {
  appendStagingRow.mockClear().mockResolvedValue(undefined);
  notifySlack.mockClear().mockResolvedValue(undefined);
  vi.restoreAllMocks();
});

describe("recordToRow", () => {
  it("serialises a record into the fixed column order with a high-severity flag count", () => {
    const row = recordToRow(buildRecord());
    expect(row).toHaveLength(STAGING_COLUMNS.length);
    expect(row[STAGING_COLUMNS.indexOf("status")]).toBe("PENDING_REVIEW");
    expect(row[STAGING_COLUMNS.indexOf("highSeverityFlagCount")]).toBe("1");
    expect(row[STAGING_COLUMNS.indexOf("factsJson")]).toContain("Leak repair");
    expect(row[STAGING_COLUMNS.indexOf("approvedAt")]).toBe("");
  });
});

describe("stageRecord", () => {
  it("writes to every configured sink", async () => {
    const outcome = await stageRecord(buildRecord());
    expect(outcome.sinks).toEqual([
      { name: "google_sheets", ok: true },
      { name: "slack", ok: true },
    ]);
  });

  it("tolerates one failing sink but throws when every sink fails", async () => {
    notifySlack.mockRejectedValueOnce(new Error("slack 500"));
    const partial = await stageRecord(buildRecord());
    expect(partial.sinks).toEqual([
      { name: "google_sheets", ok: true },
      { name: "slack", ok: false, error: "slack 500" },
    ]);

    appendStagingRow.mockRejectedValueOnce(new Error("sheets 403"));
    notifySlack.mockRejectedValueOnce(new Error("slack 500"));
    await expect(stageRecord(buildRecord())).rejects.toThrow(/All staging sinks failed/);
  });
});

describe("logger redaction", () => {
  it("removes credentials and contact PII before anything reaches the log", () => {
    expect(
      redact({ authorization: "Bearer abc", note: "call sara@example.com on +971 50 000 0000" }),
    ).toEqual({ authorization: "[redacted]", note: "call [email] on [phone]" });
  });

  it("redacts nested context passed to the logger", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("staged", { client: { email: "sara@example.com" }, apiKey: "sk-live-123" });

    const line = JSON.parse(spy.mock.calls[0]![0] as string) as { context: Record<string, unknown> };
    expect(line.context).toEqual({ client: { email: "[email]" }, apiKey: "[redacted]" });
  });
});
