import { getEnv } from "@/lib/env";
import type { StagingRecord } from "@/lib/staging/record";

function summarizeFacts(record: StagingRecord): string {
  if (!record.facts) return `Extraction failed: ${record.failureReason ?? "unknown error"}`;
  const services = record.facts.topServices
    .map((service) => `• ${service.name}${service.price ? ` — ${service.price}` : " — no price stated"}${service.price && !service.priceSourceQuote ? " ⚠️ unquoted" : ""}`)
    .join("\n");
  return services || "No services extracted.";
}

/**
 * Notifies the reviewer. The message deliberately contains the extracted prices and the
 * high-severity flags, because the whole point of the step is that a human eyeballs the
 * numbers before they reach a client's site.
 */
export async function notifySlack(record: StagingRecord): Promise<void> {
  const env = getEnv();
  if (!env.SLACK_WEBHOOK_URL) return;

  const high = record.reviewFlags.filter((flag) => flag.severity === "high");
  const lines = [
    `*Onboarding interview staged for review* — ${record.businessName ?? "unknown business"}`,
    `Status: \`${record.status}\`  |  Record: \`${record.recordId}\`${record.tier ? `  |  Tier: ${record.tier}` : ""}`,
    "",
    "*Services & pricing (verify these):*",
    summarizeFacts(record),
  ];

  if (high.length > 0) {
    lines.push("", `*${high.length} high-severity flag(s):*`, ...high.map((flag) => `• ${flag.message}`));
  }

  lines.push(
    "",
    `Review: ${env.APP_BASE_URL}/review/${record.recordId}`,
    "_Nothing has been published. Approve in the sheet or via the approve endpoint to release it._",
  );

  const response = await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: lines.join("\n") }),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook failed (${response.status}): ${(await response.text()).slice(0, 300)}`);
  }
}
