import { CLIENT_ENVS } from '@/lib/shared/core/client.env';
import { getUserCredentialsResponseSchema } from '@/lib/auth/core/schemas';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const getUserCredentials = async (privyToken: string) => {
  const url = `${CLIENT_ENVS.MW_URL}/privy/check-wallet`;
  const response = await kyFetch.get(url, {
    headers: {
      Authorization: `Bearer ${privyToken}`,
    },
  });
  const jsonData = await response.json();

  const { success: parsedSuccess, data: parsedData } =
    getUserCredentialsResponseSchema.safeParse(jsonData);

  if (!parsedSuccess) {
    // TODO: add logs, sentry
    throw new Error('Failed to parse user credentials');
  }

  if (!parsedData?.success) {
    // TODO: add logs, sentry
    throw new Error('Failed to get user credentials');
  }

  return parsedData.data;
};
