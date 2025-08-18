import { getUserResponseSchema } from '@/lib/auth/core/schemas';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const getUser = async () => {
  const response = await kyFetch.get('/api/auth/user');
  const jsonData = await response.json();

  const { success: parseSuccess, data: parsedResponse } =
    getUserResponseSchema.safeParse(jsonData);

  if (!parseSuccess) {
    throw new Error('Invalid user response');
  }

  const { success, message } = parsedResponse;
  if (!success) {
    throw new Error(message);
  }

  if (!parsedResponse.data) {
    throw new Error('User not found');
  }

  return parsedResponse.data;
};
