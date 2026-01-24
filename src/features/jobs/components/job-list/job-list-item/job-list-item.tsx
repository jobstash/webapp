import { ExternalLinkIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { LinkWithLoader } from '@/components/link-with-loader';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';
import { type JobListItemSchema } from '@/features/jobs/schemas';
import { JobListItemBadge } from './job-list-item-badge';
import { JobListItemOrg } from './job-list-item-org';
import { JobListItemInfoTags } from './job-list-item-info-tags';
import { JobListItemTechTags } from './job-list-item-tech-tags';

interface JobListItemProps {
  job: JobListItemSchema;
}

export const JobListItem = ({ job }: JobListItemProps) => {
  const { title, href, organization, infoTags, tags, badge, timestampText } =
    job;

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
          <Badge
            asChild
            variant='outline'
            className={cn(
              'rounded-md border-transparent py-1 tracking-wide',
              'bg-muted text-muted-foreground ring-1 ring-border',
            )}
          >
            <LinkWithLoader href={href}>
              <ExternalLinkIcon className='size-3' />
              View Details
            </LinkWithLoader>
          </Badge>
        </div>

        {/* Badge row */}
        {badge && (
          <div className='mb-3 flex items-center gap-2'>
            <JobListItemBadge badge={badge} />
            {badge === JOB_ITEM_BADGE.EXPERT && (
              <Badge
                variant='outline'
                className={cn(
                  'rounded-md border-transparent py-1 tracking-wide',
                  'bg-gradient-to-r from-amber-500/15 to-orange-500/15',
                  'text-amber-600 dark:text-amber-400',
                  'ring-1 ring-amber-500/20',
                )}
              >
                Urgently Hiring
              </Badge>
            )}
          </div>
        )}

        {/* Content */}
        <div className='space-y-4'>
          {/* Title with logo and timestamp */}
          <div className='flex items-stretch gap-3'>
            {organization && (
              <ImageWithFallback
                src={organization.logo ?? ''}
                alt={`${organization.name} logo`}
                width={40}
                height={40}
                className='size-10 shrink-0 rounded-lg bg-muted/50 object-contain ring-1 ring-border/50'
                fallback={
                  <div
                    className={cn(
                      'flex size-10 items-center justify-center rounded-lg',
                      'bg-linear-to-br from-muted to-muted/50',
                      'text-base font-semibold text-muted-foreground',
                      'ring-1 ring-border/50',
                    )}
                  >
                    {organization.name.charAt(0).toUpperCase()}
                  </div>
                }
              />
            )}
            <div className='flex flex-col justify-center gap-0.5'>
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
              <p className='text-xs text-muted-foreground'>
                {organization && (
                  <>
                    <LinkWithLoader
                      href={organization.href}
                      className='transition-colors hover:text-foreground hover:underline'
                    >
                      {organization.name}
                    </LinkWithLoader>
                    <span className='mx-1'>·</span>
                  </>
                )}
                {timestampText}
              </p>
            </div>
          </div>

          {/* Info Tags */}
          <JobListItemInfoTags tags={infoTags} />

          {/* Org details + Tech */}
          <div className='space-y-0'>
            {organization && <JobListItemOrg organization={organization} />}
            <JobListItemTechTags tags={tags} />
          </div>
        </div>
      </div>
    </article>
  );
};
