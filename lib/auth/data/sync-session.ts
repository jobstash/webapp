import { genericResponseSchema } from '@/lib/shared/core/schemas';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const syncSession = async (privyToken: string) => {
  const response = await kyFetch.post('/api/auth/session/sync', {
    json: {
      privyToken,
    },
  });
  const jsonData = await response.json();

  const parsedResponse = genericResponseSchema.safeParse(jsonData);

  if (!parsedResponse.success) {
    // TODO: add logs, sentry
    throw new Error('Failed to parse user credentials');
  }

  if (!parsedResponse.data?.success) {
    // TODO: add logs, sentry
    throw new Error('Failed to get user credentials');
  }

  return parsedResponse.data;
};
