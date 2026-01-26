import 'server-only';

import { clientEnv } from '@/lib/env/client';
import { JOBS_PER_PAGE } from '@/features/jobs/constants';
import { dtoToJobListPage, jobListPageDto } from '@/features/jobs/server/dtos';

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
    // Only cache requests with no search params (avoid cache stampede)
    ...(!hasSearchParams && {
      cache: 'force-cache',
      next: { revalidate: 3600 },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(
      `Failed to fetch job list page: ${response.status}${errorBody ? ` - ${errorBody}` : ''}`,
    );
  }

  const json = await response.json();
  const parsed = jobListPageDto.safeParse(json);

  if (!parsed.success) {
    console.error(
      '[fetchJobListPage] Validation failed:',
      parsed.error.flatten(),
    );
    throw new Error(
      `Invalid job list page data: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`,
    );
  }

  return dtoToJobListPage(parsed.data);
};
