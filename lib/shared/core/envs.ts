import * as z from 'zod';

const envSchema = z.object({
  FRONTEND_URL: z.string(),
  MW_URL: z.string(),
  VERI_URL: z.string(),
  PAGE_SIZE: z
    .string()
    .refine((value) => !isNaN(Number(value)), 'Must be a valid number string'),
});

export const ENV = (() => {
  const envValues = {
    FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    MW_URL: process.env.NEXT_PUBLIC_MW_URL,
    VERI_URL: process.env.NEXT_PUBLIC_VERI_URL,
    PAGE_SIZE: process.env.NEXT_PUBLIC_PAGE_SIZE,
  };

  const result = envSchema.safeParse(envValues);

  if (!result.success) {
    const errorMessages = result.error.issues
      .map((issue) => {
        const path = issue.path.join('.') || '';
        return path || issue.message;
      })
      .join('\n  - ');

    throw new Error(`Invalid envs:\n  - ${errorMessages}\n`);
  }

  return {
    FRONTEND_URL: result.data.FRONTEND_URL,
    MW_URL: result.data.MW_URL,
    VERI_URL: result.data.VERI_URL,
    PAGE_SIZE: Number(result.data.PAGE_SIZE),
  };
})();
