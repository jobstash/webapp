import 'server-only';

import { PrivyClient } from '@privy-io/server-auth';

import { serverEnv } from '@/lib/env/server';

const privyClient = new PrivyClient(
  serverEnv.PRIVY_APP_ID,
  serverEnv.PRIVY_APP_SECRET,
);

export const verifyPrivyToken = (token: string) =>
  privyClient.verifyAuthToken(token);
