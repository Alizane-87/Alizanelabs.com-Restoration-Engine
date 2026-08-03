import { extractOnboardingFacts } from "@/lib/extraction/extract";
import { logger } from "@/lib/logger";
import { flattenTranscript, resolveClient, resolveEventId, type GhlOnboardingWebhook } from "@/lib/schemas/ghl";
import { newRecordId, type StagingRecord } from "@/lib/staging/record";
import { stageRecord } from "@/lib/staging/stage";

/**
 * Extraction + staging for one onboarding interview.
 *
 * Runs after the webhook has already been acknowledged, so it must not throw into the
 * request path: a failed extraction is still staged (as EXTRACTION_FAILED) so the interview
 * surfaces to a human instead of disappearing.
 */
export async function processOnboarding(payload: GhlOnboardingWebhook): Promise<StagingRecord> {
  const recordId = newRecordId();
  const client = resolveClient(payload);
  const transcript = flattenTranscript(payload);

  const base: StagingRecord = {
    recordId,
    receivedAt: new Date().toISOString(),
    status: "PENDING_REVIEW",
    businessName: client.businessName,
    contactName: client.contactName,
    email: client.email,
    phone: client.phone,
    tier: payload.tier ?? null,
    country: payload.country ?? null,
    ghlEventId: resolveEventId(payload),
    ghlContactId: payload.contactId ?? null,
    ghlLocationId: payload.locationId ?? null,
    model: null,
    transcriptChars: transcript.length,
    recordingUrl: payload.recordingUrl ?? null,
    reviewFlags: [],
    facts: null,
    failureReason: null,
  };

  let record: StagingRecord;
  try {
    const extraction = await extractOnboardingFacts({
      transcript,
      businessName: client.businessName,
      tier: payload.tier ?? null,
      country: payload.country ?? null,
    });
    record = {
      ...base,
      status: "PENDING_REVIEW",
      model: extraction.model,
      facts: extraction.facts,
      reviewFlags: extraction.reviewFlags,
    };
    logger.info("Extraction complete", {
      recordId,
      model: extraction.model,
      flagCount: extraction.reviewFlags.length,
      promptTokens: extraction.usage.promptTokens,
      completionTokens: extraction.usage.completionTokens,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    record = {
      ...base,
      status: "EXTRACTION_FAILED",
      failureReason: reason,
      reviewFlags: [
        {
          code: "extraction_failed",
          message: `Extraction failed (${reason}). Review the recording manually.`,
          severity: "high",
        },
      ],
    };
    logger.error("Extraction failed", { recordId, error: reason });
  }

  const outcome = await stageRecord(record);
  logger.info("Record staged for human review", {
    recordId,
    status: record.status,
    sinks: outcome.sinks,
  });
  return record;
}
