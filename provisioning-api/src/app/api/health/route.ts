import { getEnv, isSheetsConfigured } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Configuration readiness, without leaking any secret values. */
export function GET(): Response {
  try {
    const env = getEnv();
    return Response.json({
      status: "ok",
      extractionModel: env.OPENAI_EXTRACTION_MODEL,
      sinks: {
        googleSheets: isSheetsConfigured(env),
        slack: Boolean(env.SLACK_WEBHOOK_URL),
      },
      sharedStore: Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),
    });
  } catch (error) {
    return Response.json(
      { status: "misconfigured", error: error instanceof Error ? error.message : "unknown" },
      { status: 503 },
    );
  }
}
