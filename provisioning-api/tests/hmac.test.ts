import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";

import { MAX_TIMESTAMP_SKEW_MS, readSignature, verifySignature } from "@/lib/security/hmac";

const secret = "shared-secret";
const rawBody = JSON.stringify({ callId: "abc", transcript: "hello" });

function sign(payload: string, encoding: "hex" | "base64"): string {
  return createHmac("sha256", secret).update(payload, "utf8").digest(encoding);
}

describe("verifySignature", () => {
  it("accepts hex, base64 and sha256-prefixed digests of the raw body", () => {
    for (const signature of [
      sign(rawBody, "hex"),
      sign(rawBody, "base64"),
      `sha256=${sign(rawBody, "hex")}`,
    ]) {
      expect(verifySignature({ rawBody, signature, secret })).toEqual({ valid: true });
    }
  });

  it("accepts a timestamp-bound signature and rejects a stale one", () => {
    const now = 1_800_000_000_000;
    const timestamp = String(Math.floor(now / 1000));
    const signature = sign(`${timestamp}.${rawBody}`, "hex");

    expect(verifySignature({ rawBody, signature, secret, timestamp, now })).toEqual({ valid: true });
    expect(
      verifySignature({ rawBody, signature, secret, timestamp, now: now + MAX_TIMESTAMP_SKEW_MS + 1000 }),
    ).toEqual({ valid: false, reason: "timestamp_skew" });
  });

  it("rejects a missing signature, a wrong secret and a mutated body", () => {
    expect(verifySignature({ rawBody, signature: null, secret })).toEqual({
      valid: false,
      reason: "missing_signature",
    });
    expect(
      verifySignature({ rawBody, signature: createHmac("sha256", "other").update(rawBody).digest("hex"), secret }),
    ).toEqual({ valid: false, reason: "signature_mismatch" });
    expect(verifySignature({ rawBody: `${rawBody} `, signature: sign(rawBody, "hex"), secret })).toEqual({
      valid: false,
      reason: "signature_mismatch",
    });
  });
});

describe("readSignature", () => {
  it("finds the signature across the header names GHL may use", () => {
    expect(readSignature(new Headers({ "x-ghl-signature": "a" }))).toBe("a");
    expect(readSignature(new Headers({ "x-webhook-signature": "b" }))).toBe("b");
    expect(readSignature(new Headers())).toBeNull();
  });
});
