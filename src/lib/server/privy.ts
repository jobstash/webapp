import 'server-only';

import { PrivyClient } from '@privy-io/server-auth';

import { clientEnv } from '@/lib/env/client';
import { serverEnv } from '@/lib/env/server';

const privyClient = new PrivyClient(
  clientEnv.PRIVY_APP_ID,
  serverEnv.PRIVY_APP_SECRET,
);

export const verifyPrivyToken = (token: string) =>
  privyClient.verifyAuthToken(token);
