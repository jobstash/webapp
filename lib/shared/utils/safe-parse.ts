import { addBreadcrumb } from '@sentry/nextjs';
import * as z from 'zod';

export const safeParse = <TSchema extends z.ZodTypeAny>(
  label: string,
  schema: TSchema,
  input: unknown,
) => {
  const result = schema.safeParse(input);

  addBreadcrumb({
    type: 'info',
    message: `safeParse::${label}`,
    data: {
      success: result.success,
      issues: result.success ? [] : result.error.issues,
    },
  });

  return result;
};
