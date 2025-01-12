'use server';

import 'server-only';

import { addBreadcrumb } from '@sentry/nextjs';

import { MW_URL } from '@/lib/shared/core/envs';
import { MwSchemaError } from '@/lib/shared/core/errors';
import { jobsCacheTags } from '@/lib/jobs/core/cache-tags';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { dtoToJobListPage } from './dto-to-job-list-page';
import { jobListPageDto } from './dtos';

interface Props {
  page: number;
  limit?: number;
}

const DEFAULT_LIMIT = 6;
const REVALIDATE_INTERVAL = 3600;

export const fetchJobListPage = async ({ page, limit = DEFAULT_LIMIT }: Props) => {
  addBreadcrumb({
    type: 'info',
    message: 'server-action::fetchJobListPage',
    data: {
      page,
      limit,
    },
  });

  const url = `${MW_URL}/jobs/list?page=${page}&limit=${limit}`;

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
