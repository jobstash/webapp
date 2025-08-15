'use client';

import { fromPromise } from 'xstate';

import { LS_KEYS } from '@/lib/shared/core/constants';
import { checkAppStatusResponseSchema } from '@/lib/shared/core/schemas';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const syncVersionActor = fromPromise(async () => {
  try {
    const current = localStorage.getItem(LS_KEYS.CURRENT_VERSION) || 'v0.0.0';

    const response = await kyFetch.get('/api/sync/version', {
      cache: 'no-cache',
      searchParams: { current },
    });
    const jsonData = await response.json();

    const { success: parseSuccess, data: parsedResponse } =
      checkAppStatusResponseSchema.safeParse(jsonData);
    if (!parseSuccess) {
      throw new Error('Invalid app status response');
    }

    const { success, message } = parsedResponse;
    if (!success) {
      throw new Error(message);
    }

    return parsedResponse.data;
  } catch (error) {
    // TODO: log error, send to sentry
    throw new Error(error instanceof Error ? error.message : 'Failed to sync version');
  }
});
