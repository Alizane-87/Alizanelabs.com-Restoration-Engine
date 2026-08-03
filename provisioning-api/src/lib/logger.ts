const SENSITIVE_KEY_PATTERN = /(secret|token|key|authorization|password|signature)/i;
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const PHONE_PATTERN = /(?:\+|\b00)\d[\d\s().-]{7,}\d/g;

function redactString(value: string): string {
  return value.replace(EMAIL_PATTERN, "[email]").replace(PHONE_PATTERN, "[phone]");
}

/**
 * Recursively redacts credentials and contact PII. Onboarding payloads contain client
 * phone numbers and emails; those belong in the staging sheet, never in platform logs.
 */
export function redact(value: unknown, depth = 0): unknown {
  if (depth > 6) return "[truncated]";
  if (typeof value === "string") return redactString(value);
  if (Array.isArray(value)) return value.map((item) => redact(item, depth + 1));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        SENSITIVE_KEY_PATTERN.test(key) ? "[redacted]" : redact(val, depth + 1),
      ]),
    );
  }
  return value;
}

type Level = "info" | "warn" | "error";

function emit(level: Level, message: string, context?: Record<string, unknown>): void {
  const line = JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? { context: redact(context) as Record<string, unknown> } : {}),
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => emit("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) => emit("warn", message, context),
  error: (message: string, context?: Record<string, unknown>) => emit("error", message, context),
};
