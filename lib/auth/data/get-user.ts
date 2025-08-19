import { getUserResponseSchema } from '@/lib/auth/core/schemas';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const getUser = async () => {
  const response = await kyFetch.get('/api/auth/user');
  const jsonData = await response.json();

  const { success: parseSuccess, data: parsedResponse } =
    getUserResponseSchema.safeParse(jsonData);

  if (!parseSuccess) {
    // TODO: add logs, sentry
    console.error('Invalid user response', jsonData);
    throw new Error('Invalid user response');
  }

  const { success, message } = parsedResponse;
  if (!success) {
    // TODO: add logs, sentry
    console.error('Invalid user response', { parsedResponse });
    throw new Error(message);
  }

  return parsedResponse.data;
};
