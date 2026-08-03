import { getEnv, isSheetsConfigured } from "@/lib/env";
import { logger } from "@/lib/logger";
import { appendStagingRow } from "@/lib/staging/sheets";
import { notifySlack } from "@/lib/staging/slack";
import type { StagingRecord } from "@/lib/staging/record";

export interface StageOutcome {
  sinks: { name: string; ok: boolean; error?: string }[];
}

/**
 * Writes the record to every configured sink. Failures are collected rather than thrown per
 * sink so that a Slack outage cannot lose a record that the sheet accepted; the caller only
 * treats staging as failed when *no* sink succeeded.
 */
export async function stageRecord(record: StagingRecord): Promise<StageOutcome> {
  const env = getEnv();
  const tasks: { name: string; run: () => Promise<void> }[] = [];

  if (isSheetsConfigured(env)) tasks.push({ name: "google_sheets", run: () => appendStagingRow(record) });
  if (env.SLACK_WEBHOOK_URL) tasks.push({ name: "slack", run: () => notifySlack(record) });

  const results = await Promise.allSettled(tasks.map((task) => task.run()));
  const sinks = results.map((result, index) => {
    const name = tasks[index]!.name;
    if (result.status === "fulfilled") return { name, ok: true };
    const error = result.reason instanceof Error ? result.reason.message : String(result.reason);
    logger.error("Staging sink failed", { sink: name, recordId: record.recordId, error });
    return { name, ok: false, error };
  });

  if (sinks.length > 0 && sinks.every((sink) => !sink.ok)) {
    throw new Error(`All staging sinks failed for ${record.recordId}`);
  }

  return { sinks };
}
