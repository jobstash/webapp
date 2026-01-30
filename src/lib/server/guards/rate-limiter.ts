import type { GuardResult } from './types';

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const ipTimestamps = new Map<string, number[]>();

// Periodically clean up expired entries
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of ipTimestamps) {
    const valid = timestamps.filter((t) => now - t < WINDOW_MS);
    if (valid.length === 0) {
      ipTimestamps.delete(ip);
    } else {
      ipTimestamps.set(ip, valid);
    }
  }
}, CLEANUP_INTERVAL_MS);
cleanupTimer.unref();

export const checkRateLimit = (ip: string): GuardResult => {
  const now = Date.now();
  const timestamps = ipTimestamps.get(ip) ?? [];
  const valid = timestamps.filter((t) => now - t < WINDOW_MS);

  if (valid.length >= MAX_REQUESTS) {
    const oldest = valid[0];
    const retryAfter = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return new Response(
      JSON.stringify({ error: 'Too many requests. Try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
        },
      },
    );
  }

  valid.push(now);
  ipTimestamps.set(ip, valid);

  return null;
};

/** Exposed for testing only */
export const _resetRateLimiter = (): void => {
  ipTimestamps.clear();
};
