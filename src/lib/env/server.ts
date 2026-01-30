import 'server-only';

import { z } from 'zod';

const schema = z.object({
  SESSION_SECRET: z.string().min(32),
  PRIVY_APP_ID: z.string().min(1),
  PRIVY_APP_SECRET: z.string().min(1),
});

export const serverEnv = schema.parse({
  SESSION_SECRET: process.env.SESSION_SECRET,
  PRIVY_APP_ID: process.env.PRIVY_APP_ID,
  PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET,
});
