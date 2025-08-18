import { createEnv } from '@t3-oss/env-nextjs';
import * as dotenv from 'dotenv';
import * as z from 'zod';

dotenv.config();

export const CLIENT_ENVS = (() => {
  const envs = createEnv({
    client: {
      NEXT_PUBLIC_FRONTEND_URL: z.url(),
      NEXT_PUBLIC_MW_URL: z.url(),
      NEXT_PUBLIC_VERI_URL: z.url(),
      NEXT_PUBLIC_PAGE_SIZE: z
        .string()
        .refine((value) => !isNaN(Number(value)), 'Must be a valid number string')
        .transform((value) => Number(value)),
    },
    runtimeEnv: {
      NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
      NEXT_PUBLIC_MW_URL: process.env.NEXT_PUBLIC_MW_URL,
      NEXT_PUBLIC_VERI_URL: process.env.NEXT_PUBLIC_VERI_URL,
      NEXT_PUBLIC_PAGE_SIZE: process.env.NEXT_PUBLIC_PAGE_SIZE,
    },
  });

  return {
    FRONTEND_URL: envs.NEXT_PUBLIC_FRONTEND_URL,
    MW_URL: envs.NEXT_PUBLIC_MW_URL,
    VERI_URL: envs.NEXT_PUBLIC_VERI_URL,
    PAGE_SIZE: envs.NEXT_PUBLIC_PAGE_SIZE,
  };
})();
