import 'server-only';

import { CLIENT_ENVS } from '@/lib/shared/core/client.env';
import { MwSchemaError } from '@/lib/shared/core/errors';

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

  // Construct URL inline
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      query.append(key, value);
    });
  }
  const url = `${CLIENT_ENVS.MW_URL}/jobs/list?${query.toString()}`;
  const response = await kyFetch(url, { cache }).json();

  const parsed = safeParse('jobListPageDto', jobListPageDto, response);
  if (!parsed.success) {
    throw new MwSchemaError('fetchJobListPage', JSON.stringify(parsed.error.issues[0]));
  }

  return dtoToJobListPage(parsed.data);
};
