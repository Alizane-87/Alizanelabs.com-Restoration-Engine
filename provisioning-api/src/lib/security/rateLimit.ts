import { getKv } from "@/lib/kv";

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
  retryAfterSeconds: number;
}

/**
 * Fixed-window limiter. The window is deliberately coarse: it exists to stop a runaway
 * GHL workflow or a probing client from spending LLM credits, not to shape traffic.
 */
export async function rateLimit(options: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const { key, limit, windowSeconds } = options;
  const window = Math.floor(Date.now() / 1000 / windowSeconds);
  const count = await getKv().increment(`ratelimit:${key}:${window}`, windowSeconds);

  return {
    allowed: count <= limit,
    count,
    limit,
    retryAfterSeconds: windowSeconds,
  };
}

/** True when this delivery id has not been seen before, i.e. it is safe to process. */
export async function claimIdempotencyKey(key: string, ttlSeconds = 24 * 60 * 60): Promise<boolean> {
  return getKv().setIfAbsent(`idempotency:${key}`, ttlSeconds);
}
