import Link from 'next/link';

import { cn } from '@/lib/utils';
import { type JobListItemSchema } from '@/features/jobs/schemas';
import { JobListItemBadge } from './job-list-item-badge';
import { JobListItemOrg } from './job-list-item-org';
import { JobListItemInfoTags } from './job-list-item-info-tags';
import { JobListItemTechTags } from './job-list-item-tech-tags';

interface JobListItemProps {
  job: JobListItemSchema;
}

export const JobListItem = ({ job }: JobListItemProps) => {
  const { title, href, organization, infoTags, tags, timestampText, badge } =
    job;

  return (
    <article
      className={cn(
        'relative rounded-lg border border-border bg-card p-4',
        'transition-shadow hover:shadow-md',
      )}
    >
      {badge && <JobListItemBadge badge={badge} />}

      <div className='space-y-3'>
        {/* Job Title */}
        <Link
          href={href}
          className='block text-lg font-semibold text-foreground hover:underline'
        >
          {title}
        </Link>

        {/* Organization */}
        {organization && <JobListItemOrg organization={organization} />}

        {/* Info Tags */}
        <JobListItemInfoTags tags={infoTags} />

        {/* Tech Tags + Timestamp */}
        <div className='flex items-center justify-between gap-4'>
          <JobListItemTechTags tags={tags} />
          <span className='shrink-0 text-xs text-muted-foreground'>
            {timestampText}
          </span>
        </div>
      </div>
    </article>
  );
};
