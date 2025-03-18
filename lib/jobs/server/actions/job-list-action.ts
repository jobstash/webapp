'use server';

import { flattenValidationErrors } from 'next-safe-action';

import * as v from 'valibot';

import { actionClient } from '@/lib/shared/utils/safe-action';

import { fetchJobListPage } from '@/lib/jobs/server/data';

const schema = v.object({
  page: v.number(),
  limit: v.optional(v.number()),
});

export const jobListAction = actionClient
  .metadata({ actionName: 'jobListAction' })
  .schema(schema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { page, limit } }) => {
    return fetchJobListPage({ page, limit });
  });
