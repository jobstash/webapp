import 'server-only';

import { cacheLife } from 'next/cache';

import { clientEnv } from '@/lib/env/client';
import { JOBS_PER_PAGE } from '@/features/jobs/constants';
import { dtoToJobListPage, jobListPageDto } from '@/features/jobs/dtos';

interface Props {
  page: number;
  limit?: number;
  searchParams?: Record<string, string>;
}

export const fetchJobListPage = async (props: Props) => {
  const hasSearchParams = Object.keys(props.searchParams ?? {}).length > 0;
  return hasSearchParams ? getJobListPage(props) : getCachedJobListPage(props);
};

const getJobListPage = async ({
  page,
  limit = JOBS_PER_PAGE,
  searchParams,
}: Props) => {
  const urlSearchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    urlSearchParams.set(key, value);
  });

  const url = `${clientEnv.MW_URL}/jobs?${urlSearchParams}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch job list page: ${response.status}`);
  }

  const json = await response.json();
  const parsed = jobListPageDto.safeParse(json);

  if (!parsed.success) {
    throw new Error('Invalid job list page data');
  }

  return dtoToJobListPage(parsed.data);
};

const getCachedJobListPage = async (props: Props) => {
  'use cache';
  cacheLife('hours');
  return getJobListPage(props);
};
