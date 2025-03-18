import * as v from 'valibot';

const envSchema = v.object({
  MW_URL: v.string(),
  PAGE_SIZE: v.pipe(
    v.string(),
    v.custom((value) => !isNaN(Number(value)), 'Must be a valid number string'),
  ),
});

export const envs = (() => {
  const envValues = {
    MW_URL: process.env.NEXT_PUBLIC_MW_URL,
    PAGE_SIZE: process.env.NEXT_PUBLIC_PAGE_SIZE,
  };

  const result = v.safeParse(envSchema, envValues);

  if (!result.success) {
    const errorMessages = result.issues
      .map((issue) => {
        const path = issue.path?.map((p) => p.key).join('.') || '';
        return path ?? issue.message;
      })
      .join('\n  - ');

    throw new Error(`Invalid envs:\n  - ${errorMessages}\n`);
  }

  return {
    MW_URL: result.output.MW_URL,
    PAGE_SIZE: Number(result.output.PAGE_SIZE),
  };
})();
