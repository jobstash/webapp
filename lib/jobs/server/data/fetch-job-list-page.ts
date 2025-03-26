'use server';

import { MwSchemaError } from '@/lib/shared/core/errors';
import { jobEndpoints } from '@/lib/jobs/core/job-endpoints';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import {
  dtoToJobListPage,
  jobListPageDto,
  jobListPageParamsDto,
} from '@/lib/jobs/server/dtos';

interface Input {
  page: number;
  limit?: number;
}

export const fetchJobListPage = async (input: Input) => {
  const parsedParams = safeParse('jobListPageParams', jobListPageParamsDto, input);
  if (!parsedParams.success) {
    throw new MwSchemaError('fetchJobListPage', JSON.stringify(parsedParams.issues[0]));
  }
  const { page, limit } = parsedParams.output;

  const url = jobEndpoints.list({ page, limit });
  const response = await kyFetch(url, { cache: 'force-cache' }).json();

  const parsed = safeParse('jobListPageDto', jobListPageDto, response);
  if (!parsed.success) {
    throw new MwSchemaError('fetchJobListPage', JSON.stringify(parsed.issues[0]));
  }

  return dtoToJobListPage(parsed.output);
};
