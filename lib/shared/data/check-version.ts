import { checkVersionResponseSchema } from '@/lib/shared/core/schemas';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const checkVersion = async (current: string) => {
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

  return parsedResponse.data;
};
