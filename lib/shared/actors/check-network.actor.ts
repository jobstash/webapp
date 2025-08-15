'use client';

import { fromPromise } from 'xstate';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const checkNetworkActor = fromPromise(async () => {
  if (navigator.onLine) {
    try {
      await kyFetch.head('/api/health', { cache: 'no-cache' });
      return true;
    } catch {
      throw new Error('Server is not reachable');
    }
  }
  throw new Error('No internet connection');
});
