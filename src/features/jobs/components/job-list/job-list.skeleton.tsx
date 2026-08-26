import type { ReactNode } from 'react';

import { JOBS_PER_PAGE } from '@/features/jobs/constants';

import { JobListItemSkeleton } from './job-list-item/job-list-item.skeleton';
import { JobListToolbar } from './job-list-toolbar';

export const JobListSkeleton = ({
  mobileFilters,
}: {
  mobileFilters?: ReactNode;
}) => {
  return (
    <div>
      <JobListToolbar>{mobileFilters}</JobListToolbar>
      <div className='space-y-4 pb-4'>
        {Array.from({ length: JOBS_PER_PAGE }).map((_, index) => (
          <JobListItemSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
