const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;
const MAX_TRACKED_CLIENTS = 10_000;

type AttemptRecord = {
  failures: number;
  resetAt: number;
};

const globalRateLimit = globalThis as typeof globalThis & {
  siteAuthAttempts?: Map<string, AttemptRecord>;
};

const attempts = globalRateLimit.siteAuthAttempts ?? new Map<string, AttemptRecord>();
globalRateLimit.siteAuthAttempts = attempts;

function removeExpired(now: number) {
  for (const [key, record] of attempts) {
    if (record.resetAt <= now) attempts.delete(key);
  }
}

export function getClientIdentifier(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || headers.get("x-real-ip")?.trim() || "unknown";
}

export function getRateLimitStatus(identifier: string) {
  const now = Date.now();
  removeExpired(now);
  const record = attempts.get(identifier);

  if (!record || record.failures < MAX_FAILURES) {
    return { limited: false, retryAfter: 0 };
  }

  return {
    limited: true,
    retryAfter: Math.max(1, Math.ceil((record.resetAt - now) / 1000))
  };
}

export function recordFailedAttempt(identifier: string) {
  const now = Date.now();
  const record = attempts.get(identifier);

  if (!record || record.resetAt <= now) {
    if (attempts.size >= MAX_TRACKED_CLIENTS) {
      const oldestIdentifier = attempts.keys().next().value;
      if (oldestIdentifier) attempts.delete(oldestIdentifier);
    }
    attempts.set(identifier, { failures: 1, resetAt: now + WINDOW_MS });
    return;
  }

  record.failures += 1;
}

export function clearFailedAttempts(identifier: string) {
  attempts.delete(identifier);
}
