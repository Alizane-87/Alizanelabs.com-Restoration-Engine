import { createHash, timingSafeEqual } from "crypto";

import { getEnv } from "@/lib/env";

function hash(value: string): Buffer {
  // Hashing first keeps the comparison constant-length as well as constant-time.
  return createHash("sha256").update(value, "utf8").digest();
}

/** Bearer-token check for the internal (CEO-facing) endpoints. */
export function isAuthorizedInternalRequest(headers: Headers): boolean {
  const header = headers.get("authorization");
  if (!header) return false;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  if (!match?.[1]) return false;
  return timingSafeEqual(hash(match[1]), hash(getEnv().APPROVAL_API_TOKEN));
}
