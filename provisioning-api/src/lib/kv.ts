import { getEnv } from "@/lib/env";

/**
 * Minimal key/value surface used for idempotency and rate limiting.
 *
 * Serverless instances do not share memory, so the in-memory implementation is
 * best-effort only (it still absorbs the common case: GHL retrying the same delivery
 * within seconds, which usually lands on a warm instance). Setting the Upstash REST
 * variables upgrades both features to be correct across instances.
 */
export interface Kv {
  /** Sets the key only if absent. Returns true when this caller won the race. */
  setIfAbsent(key: string, ttlSeconds: number): Promise<boolean>;
  /** Increments a counter, returning its new value, and applies the TTL on creation. */
  increment(key: string, ttlSeconds: number): Promise<number>;
}

const memory = new Map<string, { value: number; expiresAt: number }>();

function sweep(now: number): void {
  for (const [key, entry] of memory) {
    if (entry.expiresAt <= now) memory.delete(key);
  }
}

export const memoryKv: Kv = {
  async setIfAbsent(key, ttlSeconds) {
    const now = Date.now();
    sweep(now);
    if (memory.has(key)) return false;
    memory.set(key, { value: 1, expiresAt: now + ttlSeconds * 1000 });
    return true;
  },
  async increment(key, ttlSeconds) {
    const now = Date.now();
    sweep(now);
    const existing = memory.get(key);
    if (!existing) {
      memory.set(key, { value: 1, expiresAt: now + ttlSeconds * 1000 });
      return 1;
    }
    existing.value += 1;
    return existing.value;
  },
};

function upstashKv(url: string, token: string): Kv {
  async function command(...args: (string | number)[]): Promise<unknown> {
    const response = await fetch(url, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(args.map(String)),
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Upstash command failed with status ${response.status}`);
    }
    const body = (await response.json()) as { result?: unknown };
    return body.result;
  }

  return {
    async setIfAbsent(key, ttlSeconds) {
      return (await command("SET", key, "1", "NX", "EX", ttlSeconds)) === "OK";
    },
    async increment(key, ttlSeconds) {
      const value = Number(await command("INCR", key));
      if (value === 1) await command("EXPIRE", key, ttlSeconds);
      return value;
    },
  };
}

let cached: Kv | null = null;

export function getKv(): Kv {
  if (cached) return cached;
  const env = getEnv();
  cached =
    env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
      ? upstashKv(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN)
      : memoryKv;
  return cached;
}

/** Test helper: forgets the selected implementation and clears in-memory state. */
export function resetKv(): void {
  cached = null;
  memory.clear();
}
