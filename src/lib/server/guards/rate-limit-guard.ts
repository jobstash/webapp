import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { serverEnv } from '@/lib/env/server';

import type { GuardResult } from './types';

const redis = new Redis({
  url: serverEnv.UPSTASH_REDIS_REST_URL,
  token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
});

const createRateLimiter = (
  prefix: string,
  limit: number,
  window: Parameters<typeof Ratelimit.slidingWindow>[1],
): ((key: string) => Promise<GuardResult>) => {
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    ephemeralCache: new Map(),
    prefix,
  });

  return async (key: string): Promise<GuardResult> => {
    const { success, reset } = await ratelimit.limit(key);
    if (success) return null;

    const retryAfter = Math.ceil(Math.max(1, (reset - Date.now()) / 1000));
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
  };
};

export const checkRateLimit = createRateLimiter('ratelimit:resume', 5, '15 m');

export const checkErrorRateLimit = createRateLimiter(
  'ratelimit:error',
  20,
  '1 m',
);
