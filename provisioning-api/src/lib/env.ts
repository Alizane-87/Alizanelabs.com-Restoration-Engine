import { z } from "zod";

const envSchema = z.object({
  GHL_WEBHOOK_SECRET: z.string().min(16),
  APPROVAL_API_TOKEN: z.string().min(16),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_EXTRACTION_MODEL: z.string().default("gpt-4o-mini"),

  GOOGLE_SHEETS_SPREADSHEET_ID: z.string().optional(),
  GOOGLE_SHEETS_TAB: z.string().default("Onboarding Staging"),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().optional(),
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().optional(),
  SLACK_WEBHOOK_URL: z.string().optional(),

  APP_BASE_URL: z.string().default("http://localhost:3000"),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  MAX_WEBHOOK_BODY_BYTES: z.coerce.number().int().positive().default(1_000_000),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

/**
 * Validates process.env on first use. Throws with the offending variable names so a
 * misconfigured deployment fails loudly on the first request rather than silently
 * dropping onboarding data.
 */
export function getEnv(): Env {
  if (cached) return cached;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid environment configuration: ${issues}`);
  }

  const env = parsed.data;
  const sheetsConfigured = Boolean(
    env.GOOGLE_SHEETS_SPREADSHEET_ID &&
      env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  );
  if (!sheetsConfigured && !env.SLACK_WEBHOOK_URL) {
    throw new Error(
      "No staging sink configured: set the GOOGLE_SHEETS_* / GOOGLE_SERVICE_ACCOUNT_* variables, SLACK_WEBHOOK_URL, or both.",
    );
  }

  cached = env;
  return env;
}

/** Test helper: clears the memoized env so a test can swap process.env. */
export function resetEnvCache(): void {
  cached = null;
}

export function isSheetsConfigured(env: Env): boolean {
  return Boolean(
    env.GOOGLE_SHEETS_SPREADSHEET_ID &&
      env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  );
}
