'use server';

import { MwSchemaError } from '@/lib/shared/core/errors';
import { JOB_ENDPOINTS } from '@/lib/jobs/core/endpoints';

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
  searchParams?: Record<string, string>;
}

export const fetchJobListPage = async (input: Input) => {
  const parsedParams = safeParse('jobListPageParams', jobListPageParamsDto, input);
  if (!parsedParams.success) {
    throw new MwSchemaError(
      'fetchJobListPage',
      JSON.stringify(parsedParams.error.issues[0]),
    );
  }
  const { page, limit, searchParams } = parsedParams.data;

  // Do not cache if there are search params
  const hasSearchParams = !!searchParams && Object.keys(searchParams).length > 0;
  const cache: RequestCache = hasSearchParams ? 'no-store' : 'force-cache';

  const url = JOB_ENDPOINTS.list({ page, limit, searchParams });
  const response = await kyFetch(url, { cache }).json();

  const parsed = safeParse('jobListPageDto', jobListPageDto, response);
  if (!parsed.success) {
    throw new MwSchemaError('fetchJobListPage', JSON.stringify(parsed.error.issues[0]));
  }

  return dtoToJobListPage(parsed.data);
};
