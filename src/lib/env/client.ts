import { z } from 'zod';

const schema = z.object({
  FRONTEND_URL: z.url(),
  MW_URL: z.url(),
  PRIVY_APP_ID: z.string().min(1),
});

export const clientEnv = schema.parse({
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  MW_URL: process.env.NEXT_PUBLIC_MW_URL,
  PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
});
