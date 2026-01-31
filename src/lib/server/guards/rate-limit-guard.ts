import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { serverEnv } from '@/lib/env/server';

import type { GuardResult } from './types';

const ratelimit = new Ratelimit({
  redis: new Redis({
    url: serverEnv.UPSTASH_REDIS_REST_URL,
    token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
  }),
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  ephemeralCache: new Map(),
  prefix: 'ratelimit:resume',
});

export const checkRateLimit = async (key: string): Promise<GuardResult> => {
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
