'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { JOBS_PER_PAGE } from '@/features/jobs/constants';
import { useJobList } from '@/features/jobs/hooks';
import type { JobListPageSchema } from '@/features/jobs/schemas';
import type { PillarFilterContext } from '@/features/pillar/schemas';

import { JobListItem } from './job-list-item';
import { JobListPagination } from './job-list-pagination';
import { JobListSkeleton } from './job-list.skeleton';

interface Props {
  initialData: JobListPageSchema;
  pillarContext?: PillarFilterContext;
}

const mergeSearchParams = (
  searchParams: Record<string, string>,
  pillarContext?: PillarFilterContext,
): Record<string, string> => {
  if (!pillarContext) return searchParams;

  const { paramKey, value: pillarValue } = pillarContext;
  const userValue = searchParams[paramKey];
  const mergedValue = userValue ? `${pillarValue},${userValue}` : pillarValue;

  return { ...searchParams, [paramKey]: mergedValue };
};

/** Static fallback shown while useSearchParams hydrates */
const JobListStatic = ({ data }: { data: JobListPageSchema }) => {
  const totalPages = Math.ceil(data.total / JOBS_PER_PAGE);

  return (
    <div>
      <div className='space-y-4 pb-4'>
        {data.data.map((job) => (
          <JobListItem key={job.id} job={job} />
        ))}
      </div>
      <JobListPagination
        currentPage={1}
        totalPages={totalPages}
        searchParams={{}}
      />
    </div>
  );
};

/** Dynamic component that reads URL params and fetches data */
const JobListDynamic = ({ initialData, pillarContext }: Props) => {
  const searchParams = useSearchParams();

  // Extract page and filter params from URL
  const page = Number(searchParams.get('page')) || 1;
  const filterParams = Object.fromEntries(
    [...searchParams.entries()].filter(([key]) => key !== 'page'),
  );

  // Check if we're on the initial state (page 1, no filters)
  const hasFilters = Object.keys(filterParams).length > 0;
  const isInitialState = page === 1 && !hasFilters;

  // Merge with pillar context for the API call
  const mergedParams = mergeSearchParams(filterParams, pillarContext);

  const { data, isFetching, isError } = useJobList({
    page,
    searchParams: mergedParams,
    initialData: isInitialState ? initialData : undefined,
  });

  if (isError) {
    return (
      <div
        role='alert'
        className='flex flex-col items-center justify-center gap-2 py-12'
      >
        <p className='text-muted-foreground'>Failed to load jobs</p>
        <p className='text-sm text-muted-foreground'>
          Please try refreshing the page
        </p>
      </div>
    );
  }

  // Use data from query, fall back to initialData during loading
  const jobData = data ?? initialData;
  const totalPages = Math.ceil(jobData.total / JOBS_PER_PAGE);

  return (
    <div>
      {isFetching ? (
        <JobListSkeleton />
      ) : (
        <div className='space-y-4 pb-4'>
          {jobData.data.map((job) => (
            <JobListItem key={job.id} job={job} />
          ))}
        </div>
      )}
      <JobListPagination
        currentPage={page}
        totalPages={totalPages}
        searchParams={filterParams}
      />
    </div>
  );
};

export const JobListHybrid = ({ initialData, pillarContext }: Props) => {
  return (
    <Suspense fallback={<JobListStatic data={initialData} />}>
      <JobListDynamic initialData={initialData} pillarContext={pillarContext} />
    </Suspense>
  );
};
