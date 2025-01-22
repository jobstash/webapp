'use server';

// import 'server-only';

import { addBreadcrumb } from '@sentry/nextjs';

import { MwSchemaError } from '@/lib/shared/core/errors';
import { jobsCacheTags } from '@/lib/jobs/core/cache-tags';
import { jobEndpoints } from '@/lib/jobs/core/job-endpoints';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { dtoToJobListPage } from './dto-to-job-list-page';
import { jobListPageDto, jobListPageParamsDto } from './dtos';

interface Props {
  page: number;
  limit?: number;
}

const REVALIDATE_INTERVAL = 3600;

export const fetchJobListPage = async (props: Props) => {
  addBreadcrumb({
    type: 'info',
    message: 'server-action::fetchJobListPage',
    data: {
      page: props.page,
      limit: props.limit,
    },
  });

  const parsedParams = safeParse('jobListPageParams', jobListPageParamsDto, props);
  if (!parsedParams.success) {
    throw new MwSchemaError('fetchJobListPage', JSON.stringify(parsedParams.issues[0]));
  }
  const { page, limit } = parsedParams.output;

  const url = jobEndpoints.list({ page, limit });
  const response = await kyFetch(url, {
    next: {
      revalidate: REVALIDATE_INTERVAL,
      tags: [jobsCacheTags.list(page)],
    },
  }).json();

  const parsed = safeParse('jobListPageDto', jobListPageDto, response);
  if (!parsed.success) {
    throw new MwSchemaError('fetchJobListPage', JSON.stringify(parsed.issues[0]));
  }

  return dtoToJobListPage(parsed.output);
};
