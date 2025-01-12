import { addBreadcrumb } from '@sentry/nextjs';
import * as v from 'valibot';

export const safeParse = <
  TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(
  label: string,
  schema: TSchema,
  input: unknown,
): v.SafeParseResult<TSchema> => {
  const result = v.safeParse(schema, input);

  addBreadcrumb({
    type: 'info',
    message: `safeParse::${label}`,
    data: {
      typed: result.typed,
      success: result.success,
      issues: result.issues ? v.flatten<typeof schema>(result.issues) : [],
    },
  });

  return result;
};
