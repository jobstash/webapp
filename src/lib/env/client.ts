import { z } from 'zod';

const schema = z.object({
  FRONTEND_URL: z.url(),
  MW_URL: z.url(),
});

export const clientEnv = schema.parse({
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  MW_URL: process.env.NEXT_PUBLIC_MW_URL,
});
