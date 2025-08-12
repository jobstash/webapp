'use server';

import { flattenValidationErrors, InferSafeActionFnResult } from 'next-safe-action';

import * as z from 'zod';

import { actionClient } from '@/lib/shared/utils/safe-action';

import { fetchJobListPage } from '@/lib/jobs/server/data';

const schema = z.object({
  page: z.number(),
  limit: z.optional(z.number()),
  searchParams: z.optional(z.record(z.string(), z.string())),
});

export const jobListAction = actionClient
  .metadata({ actionName: 'jobListAction' })
  .schema(schema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { page, limit, searchParams } }) => {
    return fetchJobListPage({ page, limit, searchParams });
  });

export type JobListActionResult = InferSafeActionFnResult<typeof jobListAction>;
