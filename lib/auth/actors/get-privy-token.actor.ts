import { getAccessToken } from '@privy-io/react-auth';
import { fromPromise } from 'xstate';

export const getPrivyTokenActor = fromPromise(async () => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error('No Privy token found');
  }

  return token;
});
