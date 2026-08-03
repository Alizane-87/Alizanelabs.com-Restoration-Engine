import { after, type NextRequest } from "next/server";

import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { processOnboarding } from "@/lib/pipeline/processOnboarding";
import { ghlOnboardingWebhookSchema, flattenTranscript, resolveEventId } from "@/lib/schemas/ghl";
import { readSignature, TIMESTAMP_HEADER, verifySignature } from "@/lib/security/hmac";
import { claimIdempotencyKey, rateLimit } from "@/lib/security/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** The 202 returns in milliseconds; this budget covers the LLM call in `after()`. */
export const maxDuration = 60;

const RATE_LIMIT_PER_MINUTE = 120;

function json(body: unknown, status: number, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

/**
 * GHL fires this after the onboarding AI finishes its interview.
 *
 * The handler is intentionally split in two: everything that can reject a request (signature,
 * size, rate limit, schema, duplicate) happens inline, and the expensive work (LLM extraction,
 * Sheets/Slack writes) runs in `after()` once a 202 has been returned. GHL retries on timeout,
 * so acknowledging fast is what keeps duplicate interviews — and duplicate LLM spend — down.
 */
export async function POST(request: NextRequest): Promise<Response> {
  const env = getEnv();

  const rate = await rateLimit({
    key: `ghl-onboarding:${request.headers.get("x-forwarded-for") ?? "unknown"}`,
    limit: RATE_LIMIT_PER_MINUTE,
    windowSeconds: 60,
  });
  if (!rate.allowed) {
    logger.warn("Webhook rate limited", { count: rate.count, limit: rate.limit });
    return json({ error: "rate_limited" }, 429, { "retry-after": String(rate.retryAfterSeconds) });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > env.MAX_WEBHOOK_BODY_BYTES) {
    return json({ error: "payload_too_large" }, 413);
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > env.MAX_WEBHOOK_BODY_BYTES) {
    return json({ error: "payload_too_large" }, 413);
  }

  const verification = verifySignature({
    rawBody,
    signature: readSignature(request.headers),
    secret: env.GHL_WEBHOOK_SECRET,
    timestamp: request.headers.get(TIMESTAMP_HEADER),
  });
  if (!verification.valid) {
    logger.warn("Rejected webhook", { reason: verification.reason });
    return json({ error: "invalid_signature" }, 401);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const parsed = ghlOnboardingWebhookSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        error: "invalid_payload",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      422,
    );
  }

  const payload = parsed.data;
  if (!flattenTranscript(payload)) {
    return json({ error: "missing_transcript" }, 422);
  }

  const eventId = resolveEventId(payload);
  if (eventId) {
    const claimed = await claimIdempotencyKey(`ghl-onboarding:${eventId}`);
    if (!claimed) {
      logger.info("Duplicate webhook ignored", { eventId });
      return json({ status: "duplicate_ignored", eventId }, 200);
    }
  }

  after(async () => {
    try {
      await processOnboarding(payload);
    } catch (error) {
      logger.error("Onboarding processing failed", {
        eventId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  return json({ status: "accepted", eventId }, 202);
}

export function GET(): Response {
  return json({ error: "method_not_allowed" }, 405);
}
