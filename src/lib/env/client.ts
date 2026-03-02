// Validated at build/dev start in next.config.ts — no runtime Zod needed
export const clientEnv = {
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL!,
  MW_URL: process.env.NEXT_PUBLIC_MW_URL!,
  PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  PRIVY_CLIENT_ID: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID,
  ALLOW_INDEXING: process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true',
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
};
