import { type KyResponse } from 'ky';

import { profileCheckResponseSchema } from '@/lib/profile/core/schemas';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const checkProfileEntry = async () => {
  let response: KyResponse<unknown>;
  try {
    response = await kyFetch.get('/api/profile/entry');
  } catch (error) {
    // TODO: Log error, send to sentry
    console.error('Failed to fetch check profile entry', error);
    throw error;
  }

  if (!response.ok) {
    // TODO: Log error, send to sentry
    throw new Error('Failed check profile entry response');
  }

  let jsonData: unknown;
  try {
    jsonData = await response.json();
  } catch (error) {
    // TODO: Log error, send to sentry
    console.error('Malformed response from check profile entry', error);
    throw error;
  }

  const { success: parseSuccess, data: parsedResponse } =
    profileCheckResponseSchema.safeParse(jsonData);

  if (!parseSuccess) {
    // TODO: Log error, send to sentry
    throw new Error('Invalid response from check profile entry');
  }

  if (!parsedResponse) {
    // TODO: Log error, send to sentry
    throw new Error('No response from check profile entry');
  }

  if (!parsedResponse.success) {
    // TODO: Log error, send to sentry
    throw new Error('Check profile entry response failed');
  }

  return parsedResponse.data;
};
