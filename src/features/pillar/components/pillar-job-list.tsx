import Link from 'next/link';
import { ArrowRightIcon, SearchIcon } from 'lucide-react';

import { JobListItem } from '@/features/jobs/components/job-list/job-list-item';
import { getPillarName } from '@/features/pillar/constants';
import { fetchPillarJobs } from '@/features/pillar/server/data';
import type { PillarFilterContext } from '@/features/pillar/schemas';

interface Props {
  slug: string;
  pillarContext: PillarFilterContext;
}

export const PillarJobList = async ({ slug, pillarContext }: Props) => {
  const pillarName = getPillarName(slug);
  const { paramKey, value } = pillarContext;

  try {
    const data = await fetchPillarJobs({ pillarContext });

    if (data.length === 0) {
      return (
        <EmptyState pillarName={pillarName} paramKey={paramKey} value={value} />
      );
    }

    return (
      <div className='space-y-4'>
        {data.map((job) => (
          <JobListItem key={job.id} job={job} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('[PillarJobList] Failed to load jobs:', error);
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
};

interface EmptyStateProps {
  pillarName: string;
  paramKey: string;
  value: string;
}

const EmptyState = ({ pillarName, paramKey, value }: EmptyStateProps) => {
  const href = `/?${paramKey}=${encodeURIComponent(value)}`;

  return (
    <div className='flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/50 bg-card px-6 py-12'>
      <SearchIcon className='size-8 text-muted-foreground/50' />

      <div className='space-y-1 text-center'>
        <p className='font-medium text-foreground'>
          No {pillarName} jobs posted this month
        </p>
        <p className='text-sm text-muted-foreground'>
          Check back soon or explore all available positions
        </p>
      </div>

      <Link
        href={href}
        className='group inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted/80'
      >
        View all {pillarName} jobs
        <ArrowRightIcon className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
      </Link>
    </div>
  );
};
