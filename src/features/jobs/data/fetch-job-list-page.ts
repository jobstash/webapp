import 'server-only';

import { clientEnv } from '@/lib/env/client';
import { JOBS_PER_PAGE } from '@/features/jobs/constants';
import { dtoToJobListPage, jobListPageDto } from '@/features/jobs/dtos';

interface Props {
  page: number;
  limit?: number;
  searchParams?: Record<string, string>;
}

export const fetchJobListPage = async ({
  page,
  limit = JOBS_PER_PAGE,
  searchParams,
}: Props) => {
  const hasSearchParams = Object.keys(searchParams ?? {}).length > 0;

  const urlSearchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    urlSearchParams.set(key, value);
  });

  const url = `${clientEnv.MW_URL}/jobs/list?${urlSearchParams}`;
  const response = await fetch(url, {
    // Do not cache requests with search params (avoid cache stampede)
    ...(!hasSearchParams && { next: { revalidate: 3600 } }),
  });

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
