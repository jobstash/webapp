import { genericResponseSchema } from '@/lib/shared/core/schemas';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const logout = async () => {
  const response = await kyFetch.post('/api/auth/logout');
  const jsonData = await response.json();

  const { success: parseSuccess, data: parsedResponse } =
    genericResponseSchema.safeParse(jsonData);

  if (!parseSuccess) {
    // TODO: add logs, sentry
    throw new Error('Invalid logout response');
  }

  const { success, message } = parsedResponse;
  if (!success) {
    // TODO: add logs, sentry
    throw new Error(message);
  }

  return message;
};
