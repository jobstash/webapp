import { type KyResponse } from 'ky';

import {
  getProfileInfoResponse,
  type ProfileInfoSchema,
} from '@/lib/profile/core/schemas';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const getProfileInfo = async (): Promise<ProfileInfoSchema> => {
  let response: KyResponse<unknown>;
  try {
    response = await kyFetch.get('/api/profile/info');
  } catch (error) {
    // TODO: Log error, send to sentry
    console.error('Failed to fetch profile info', error);
    throw error;
  }

  if (!response.ok) {
    // TODO: Log error, send to sentry
    throw new Error('Failed to fetch profile info');
  }

  let jsonData: unknown;
  try {
    jsonData = await response.json();
  } catch (error) {
    // TODO: Log error, send to sentry
    console.error('Failed to parse profile info', error);
    throw error;
  }

  const parseResult = getProfileInfoResponse.safeParse(jsonData);

  if (!parseResult.success) {
    // TODO: Log error, send to sentry
    throw new Error('Invalid profile info response');
  }

  if (!parseResult.data.success) {
    // TODO: Log error, send to sentry
    throw new Error('API response failed');
  }

  return parseResult.data.data;
};
