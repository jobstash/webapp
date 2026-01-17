import { ExternalLinkIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LinkWithLoader } from '@/components/link-with-loader';
import { type JobListItemSchema } from '@/features/jobs/schemas';
import { JobListItemBadge } from './job-list-item-badge';
import { JobListItemOrg } from './job-list-item-org';
import { JobListItemInfoTags } from './job-list-item-info-tags';
import { JobListItemTechTags } from './job-list-item-tech-tags';

interface JobListItemProps {
  job: JobListItemSchema;
}

export const JobListItem = ({ job }: JobListItemProps) => {
  const { title, href, organization, infoTags, tags, badge } = job;

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-card',
        'border border-border/50 shadow-sm',
        'transition-all duration-200',
        'hover:border-border hover:shadow-md',
      )}
    >
      {/* Subtle gradient accent on hover */}
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-px',
          'bg-linear-to-r from-transparent via-primary/20 to-transparent',
          'opacity-0 transition-opacity duration-300',
          'group-hover:opacity-100',
        )}
      />

      <div className='p-5 pb-3'>
        {/* View Details - top right */}
        <div className='absolute top-5 right-5'>
          <Badge variant='outline' asChild className='rounded-md py-1'>
            <LinkWithLoader href={href}>
              <ExternalLinkIcon className='size-3' />
              View Details
            </LinkWithLoader>
          </Badge>
        </div>

        {/* Badge - standalone row if present */}
        {badge && (
          <div className='mb-3 flex h-6 self-baseline'>
            <JobListItemBadge badge={badge} />
          </div>
        )}

        {/* Content */}
        <div className='space-y-4'>
          {/* Title */}
          <div className='flex h-6 justify-between gap-4 self-baseline'>
            <LinkWithLoader
              href={href}
              className={cn(
                'text-lg leading-tight font-semibold text-foreground',
                'transition-colors duration-150',
                'hover:text-primary hover:underline',
              )}
            >
              {title}
            </LinkWithLoader>
          </div>

          {/* Info Tags */}
          <JobListItemInfoTags tags={infoTags} />

          {/* Org + Tech grouped with tighter spacing */}
          <div className='space-y-0'>
            {organization && <JobListItemOrg organization={organization} />}
            <div
              className={cn(
                !!organization?.fundingRounds.length ||
                  !!organization?.investors.length
                  ? 'mt-0'
                  : 'mt-2',
              )}
            >
              <JobListItemTechTags tags={tags} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
