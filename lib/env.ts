import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  /** Absolute public origin, e.g. https://alizanelabs.com. Used for canonicals, sitemap, OG. */
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://alizanelabs.com"),
  /** Optional external scheduling URL. When unset, CTAs fall back to /dispatch-audit. */
  NEXT_PUBLIC_SCHEDULING_URL: z.string().url().optional(),
  /** Optional demo phone number in E.164 form. Rendered only when set. */
  NEXT_PUBLIC_DEMO_PHONE: z
    .string()
    .regex(/^\+[1-9]\d{7,14}$/, "NEXT_PUBLIC_DEMO_PHONE must be E.164, e.g. +15551234567")
    .optional(),
  /** Server-side webhook that receives qualified leads. Never exposed to the client. */
  LEAD_WEBHOOK_URL: z.string().url().optional(),
  /** Optional bearer token sent with the lead webhook request. */
  LEAD_WEBHOOK_TOKEN: z.string().min(1).optional(),
  /** Optional mailbox notified about new leads by the configured email adapter. */
  LEAD_NOTIFY_EMAIL: z.string().email().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid environment configuration — ${issues}`);
}

export const env = parsed.data;

export const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/** True when a real scheduling destination is configured. */
export const hasScheduling = Boolean(env.NEXT_PUBLIC_SCHEDULING_URL);

/** True when lead submissions leave the server for a real destination. */
export const hasLeadDestination = Boolean(env.LEAD_WEBHOOK_URL);
