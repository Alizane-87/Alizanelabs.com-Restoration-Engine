import { createHmac, timingSafeEqual } from "crypto";

export const SIGNATURE_HEADERS = ["x-ghl-signature", "x-webhook-signature", "x-hub-signature-256"];
export const TIMESTAMP_HEADER = "x-ghl-timestamp";

/** Rejects replays of an old, validly signed body. */
export const MAX_TIMESTAMP_SKEW_MS = 5 * 60 * 1000;

function normalize(signature: string): string {
  return signature.trim().replace(/^sha256=/i, "");
}

function equals(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/**
 * Verifies an HMAC-SHA256 signature over the raw request body, accepting either a hex or
 * base64 digest, and optionally binding the signature to a timestamped payload
 * (`<timestamp>.<body>`) so a captured request cannot be replayed indefinitely.
 */
export function verifySignature(options: {
  rawBody: string;
  signature: string | null;
  secret: string;
  timestamp?: string | null;
  now?: number;
}): { valid: true } | { valid: false; reason: string } {
  const { rawBody, signature, secret, timestamp, now = Date.now() } = options;

  if (!signature) return { valid: false, reason: "missing_signature" };

  if (timestamp) {
    const parsed = Number(timestamp);
    if (!Number.isFinite(parsed)) return { valid: false, reason: "invalid_timestamp" };
    const millis = parsed < 1e12 ? parsed * 1000 : parsed;
    if (Math.abs(now - millis) > MAX_TIMESTAMP_SKEW_MS) {
      return { valid: false, reason: "timestamp_skew" };
    }
  }

  const payloads = timestamp ? [`${timestamp}.${rawBody}`, rawBody] : [rawBody];
  const provided = normalize(signature);

  for (const payload of payloads) {
    const mac = createHmac("sha256", secret).update(payload, "utf8");
    const digest = mac.digest();
    if (equals(provided, digest.toString("hex")) || equals(provided, digest.toString("base64"))) {
      return { valid: true };
    }
  }

  return { valid: false, reason: "signature_mismatch" };
}

export function readSignature(headers: Headers): string | null {
  for (const header of SIGNATURE_HEADERS) {
    const value = headers.get(header);
    if (value) return value;
  }
  return null;
}
