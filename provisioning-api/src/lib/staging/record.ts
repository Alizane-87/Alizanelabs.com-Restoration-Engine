import { randomUUID } from "crypto";

import type { OnboardingFacts, ReviewFlag } from "@/lib/schemas/facts";

export const STAGING_STATUSES = ["PENDING_REVIEW", "APPROVED", "REJECTED", "EXTRACTION_FAILED"] as const;
export type StagingStatus = (typeof STAGING_STATUSES)[number];

export interface StagingRecord {
  recordId: string;
  receivedAt: string;
  status: StagingStatus;
  businessName: string | null;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  tier: string | null;
  country: string | null;
  ghlEventId: string | null;
  ghlContactId: string | null;
  ghlLocationId: string | null;
  model: string | null;
  transcriptChars: number;
  recordingUrl: string | null;
  reviewFlags: ReviewFlag[];
  facts: OnboardingFacts | null;
  failureReason: string | null;
}

export function newRecordId(): string {
  return `stg_${randomUUID()}`;
}

/** Column order of the staging sheet. Append-only: never reorder, the sheet is live. */
export const STAGING_COLUMNS = [
  "recordId",
  "receivedAt",
  "status",
  "businessName",
  "contactName",
  "email",
  "phone",
  "tier",
  "country",
  "ghlEventId",
  "ghlContactId",
  "ghlLocationId",
  "model",
  "transcriptChars",
  "recordingUrl",
  "highSeverityFlagCount",
  "reviewFlags",
  "factsJson",
  "failureReason",
  "approvedAt",
  "approvedBy",
] as const;

export const STATUS_COLUMN_INDEX = STAGING_COLUMNS.indexOf("status");
export const APPROVED_AT_COLUMN_INDEX = STAGING_COLUMNS.indexOf("approvedAt");
export const APPROVED_BY_COLUMN_INDEX = STAGING_COLUMNS.indexOf("approvedBy");

export function recordToRow(record: StagingRecord): string[] {
  const highSeverity = record.reviewFlags.filter((flag) => flag.severity === "high").length;
  const values: Record<(typeof STAGING_COLUMNS)[number], string> = {
    recordId: record.recordId,
    receivedAt: record.receivedAt,
    status: record.status,
    businessName: record.businessName ?? "",
    contactName: record.contactName ?? "",
    email: record.email ?? "",
    phone: record.phone ?? "",
    tier: record.tier ?? "",
    country: record.country ?? "",
    ghlEventId: record.ghlEventId ?? "",
    ghlContactId: record.ghlContactId ?? "",
    ghlLocationId: record.ghlLocationId ?? "",
    model: record.model ?? "",
    transcriptChars: String(record.transcriptChars),
    recordingUrl: record.recordingUrl ?? "",
    highSeverityFlagCount: String(highSeverity),
    reviewFlags: record.reviewFlags.map((flag) => `[${flag.severity}] ${flag.message}`).join("\n"),
    factsJson: record.facts ? JSON.stringify(record.facts, null, 2) : "",
    failureReason: record.failureReason ?? "",
    approvedAt: "",
    approvedBy: "",
  };
  return STAGING_COLUMNS.map((column) => values[column]);
}
