import { type KyResponse } from 'ky';

import { genericResponseSchema } from '@/lib/shared/core/schemas';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const processRequiredInfo = async () => {
  let response: KyResponse<unknown>;

  try {
    response = await kyFetch.post('/api/profile/required-info');
  } catch {
    // TODO: Log error, send to sentry
    throw new Error('Failed to send process required info request');
  }

  if (!response.ok) {
    // TODO: Log error, send to sentry
    throw new Error('Failed to process required info');
  }

  let jsonData: unknown;
  try {
    jsonData = await response.json();
  } catch {
    // TODO: Log error, send to sentry
    throw new Error('Malformed process required info response');
  }

  const { success: parseSuccess, data: parsedResponse } =
    genericResponseSchema.safeParse(jsonData);

  if (!parseSuccess) {
    // TODO: Log error, send to sentry
    throw new Error('Invalid process required info response');
  }

  if (!parsedResponse) {
    // TODO: Log error, send to sentry
    throw new Error('No response from process required info');
  }

  if (!parsedResponse.success) {
    // TODO: Log error, send to sentry
    throw new Error('Process required info response failed');
  }
};
