import { type KyResponse } from 'ky';

import { processCVResponseSchema } from '@/lib/profile/core/schemas';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const processCV = async () => {
  let response: KyResponse<unknown>;

  try {
    response = await kyFetch.post('/api/profile/cv');
  } catch {
    // TODO: Log error, send to sentry
    throw new Error('Failed to send process CV request');
  }

  if (!response.ok) {
    // TODO: Log error, send to sentry
    throw new Error('Failed to process CV');
  }

  let jsonData: unknown;
  try {
    jsonData = await response.json();
  } catch {
    // TODO: Log error, send to sentry
    throw new Error('Malformed process CV response');
  }

  const { success: parseSuccess, data: parsedResponse } =
    processCVResponseSchema.safeParse(jsonData);

  if (!parseSuccess) {
    // TODO: Log error, send to sentry
    throw new Error('Invalid process CV response');
  }

  if (!parsedResponse) {
    // TODO: Log error, send to sentry
    throw new Error('No response from process CV');
  }

  if (!parsedResponse.success) {
    // TODO: Log error, send to sentry
    throw new Error('Process CV response failed');
  }

  return parsedResponse.data;
};
