import Link from 'next/link';
import { ArrowRightIcon, SearchIcon } from 'lucide-react';

import { fetchJobListPage } from '@/features/jobs/server/data';
import { JOBS_PER_PAGE } from '@/features/jobs/constants';
import type { PillarFilterContext } from '@/features/pillar/schemas';

import { JobListPagination } from './job-list-pagination';
import { JobListItem } from './job-list-item';

interface JobListProps {
  currentPage: number;
  searchParams: Record<string, string>;
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

interface EmptyStateProps {
  hasFilters: boolean;
}

const EmptyState = ({ hasFilters }: EmptyStateProps) => (
  <div className='flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/50 bg-card px-6 py-12'>
    <SearchIcon className='size-8 text-muted-foreground/50' />

    <div className='space-y-1 text-center'>
      <p className='font-medium text-foreground'>
        {hasFilters
          ? 'No results for these filters'
          : 'No jobs available right now'}
      </p>
      <p className='text-sm text-muted-foreground'>
        {hasFilters
          ? 'Try adjusting your filters or clear them to see all jobs'
          : 'Check back soon'}
      </p>
    </div>

    {hasFilters && (
      <Link
        href='/'
        className='group inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted/80'
      >
        Clear filters
        <ArrowRightIcon className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
      </Link>
    )}
  </div>
);

export const JobList = async ({
  currentPage,
  searchParams,
  pillarContext,
}: JobListProps) => {
  const mergedParams = mergeSearchParams(searchParams, pillarContext);
  const { total, data } = await fetchJobListPage({
    page: currentPage,
    searchParams: mergedParams,
  });

  if (data.length === 0) {
    return <EmptyState hasFilters={Object.keys(searchParams).length > 0} />;
  }

  const totalPages = Math.ceil(total / JOBS_PER_PAGE);

  return (
    <div>
      <div className='space-y-4 pb-4'>
        {data.map((job) => (
          <JobListItem key={job.id} job={job} />
        ))}
      </div>
      <JobListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={searchParams}
      />
    </div>
  );
};
