'use client';

import { fromPromise } from 'xstate';

import { LS_KEYS } from '@/lib/shared/core/constants';
import { checkVersionResponseSchema } from '@/lib/shared/core/schemas';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const checkVersionActor = fromPromise(async () => {
  try {
    const current = localStorage.getItem(LS_KEYS.CURRENT_VERSION) || '0.0.0';

    const response = await kyFetch.get('/api/version', {
      cache: 'no-cache',
      searchParams: { current },
    });
    const jsonData = await response.json();

    const { success: parseSuccess, data: parsedResponse } =
      checkVersionResponseSchema.safeParse(jsonData);
    if (!parseSuccess) {
      throw new Error('Invalid app status response');
    }

    const { success, message } = parsedResponse;
    if (!success) {
      throw new Error(message);
    }

    // Persist the current version to local storage if different
    const serverVersion = parsedResponse.data.version;
    if (serverVersion !== current) {
      localStorage.setItem(LS_KEYS.CURRENT_VERSION, serverVersion);
    }

    return parsedResponse.data;
  } catch (error) {
    // TODO: log error, send to sentry
    throw new Error(error instanceof Error ? error.message : 'Failed to sync version');
  }
});
