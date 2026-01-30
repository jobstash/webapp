import { clientEnv } from '@/lib/env/client';

import type { GuardResult } from './types';
import { guardError } from './types';

export const checkOrigin = (request: Request): GuardResult => {
  if (process.env.NODE_ENV === 'development') return null;

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Allow requests with no origin and no referer (some browsers on same-origin)
  if (!origin && !referer) return null;

  const frontendUrl = clientEnv.FRONTEND_URL;

  if (origin) {
    if (origin === frontendUrl) return null;
    return guardError('Forbidden', 403);
  }

  if (referer) {
    if (referer.startsWith(frontendUrl)) return null;
    return guardError('Forbidden', 403);
  }

  return null;
};
