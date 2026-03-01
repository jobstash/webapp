import { z } from 'zod';

const schema = z.object({
  FRONTEND_URL: z.url(),
  MW_URL: z.url(),
  PRIVY_APP_ID: z.string().min(1),
  PRIVY_CLIENT_ID: z.string().min(1).optional(),
  ALLOW_INDEXING: z.stringbool().optional().default(false),
  GA_MEASUREMENT_ID: z.string().optional(),
});

export const clientEnv = schema.parse({
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  MW_URL: process.env.NEXT_PUBLIC_MW_URL,
  PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  PRIVY_CLIENT_ID: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID,
  ALLOW_INDEXING: process.env.NEXT_PUBLIC_ALLOW_INDEXING,
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
});
