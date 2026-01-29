import Link from 'next/link';
import { ArrowRightIcon, SearchIcon } from 'lucide-react';

import { JobListItem } from '@/features/jobs/components/job-list/job-list-item';
import type { JobListItemSchema } from '@/features/jobs/schemas';
import {
  getPillarFilterHref,
  getPillarName,
} from '@/features/pillar/constants';
import type { PillarFilterContext } from '@/features/pillar/schemas';

interface Props {
  slug: string;
  pillarContext: PillarFilterContext | null;
  jobs: JobListItemSchema[];
}

export const PillarJobList = ({ slug, pillarContext, jobs }: Props) => {
  const pillarName = getPillarName(slug);

  if (jobs.length === 0) {
    return <EmptyState pillarName={pillarName} pillarContext={pillarContext} />;
  }

  return (
    <div className='space-y-4'>
      {jobs.map((job) => (
        <JobListItem key={job.id} job={job} />
      ))}
    </div>
  );
};

interface EmptyStateProps {
  pillarName: string;
  pillarContext: PillarFilterContext | null;
}

const EmptyState = ({ pillarName, pillarContext }: EmptyStateProps) => {
  const href = getPillarFilterHref(pillarContext);
  const linkText = pillarContext
    ? `View all ${pillarName} jobs`
    : 'Browse all jobs';

  return (
    <div className='flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/50 bg-card px-6 py-12'>
      <SearchIcon className='size-8 text-muted-foreground/50' />

      <div className='space-y-1 text-center'>
        <p className='font-medium text-foreground'>
          No jobs published for this criteria in the past 30 days
        </p>
        <p className='text-sm text-muted-foreground'>
          Check back soon or explore all available positions
        </p>
      </div>

      <Link
        href={href}
        className='group inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted/80'
      >
        {linkText}
        <ArrowRightIcon className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
      </Link>
    </div>
  );
};
