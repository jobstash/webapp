import Link from 'next/link';

import { LinkWithLoader } from '@/components/link-with-loader';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, MapPin, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { type JobOrganizationSchema } from '@/features/jobs/schemas';

interface JobListItemOrgProps {
  organization: JobOrganizationSchema;
}

export const JobListItemOrg = ({ organization }: JobListItemOrgProps) => {
  const {
    name,
    href,
    websiteUrl,
    location,
    logo,
    employeeCount,
    fundingRounds,
    investors,
  } = organization;

  const hasExpandableContent = fundingRounds.length > 0 || investors.length > 0;

  return (
    <div className='space-y-2'>
      {/* Organization header */}
      <div className='flex items-center gap-3'>
        <ImageWithFallback
          src={logo ?? ''}
          alt={`${name} logo`}
          width={40}
          height={40}
          className='shrink-0 rounded-lg ring-1 ring-border/50'
          fallback={
            <div
              className={cn(
                'flex size-10 items-center justify-center rounded-lg',
                'bg-linear-to-br from-muted to-muted/50',
                'text-sm font-semibold text-muted-foreground',
                'ring-1 ring-border/50',
              )}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          }
        />

        {/* Title + Subtitle */}
        <div className='flex min-w-0 flex-col gap-1'>
          <div className='flex flex-wrap items-center gap-1.5'>
            {websiteUrl ? (
              <Link
                href={websiteUrl}
                target='_blank'
                rel='noopener'
                // oxlint-disable-next-line aria-proptypes
                aria-label={`Visit ${name} website`}
                className={cn(
                  'text-sm font-medium text-foreground',
                  'transition-colors duration-150',
                  'hover:text-primary',
                )}
              >
                <span className='truncate'>{name}</span>
              </Link>
            ) : (
              <span className='truncate text-sm font-medium text-foreground'>
                {name}
              </span>
            )}
            <span className='text-xs text-muted-foreground/40'>|</span>
            <LinkWithLoader
              href={href}
              className={cn(
                'text-xs text-muted-foreground',
                'transition-colors duration-150',
                'hover:text-foreground',
              )}
            >
              View jobs by {name}
            </LinkWithLoader>
          </div>
          {(location || employeeCount) && (
            <div className='flex flex-wrap items-center gap-2'>
              {location && (
                <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <MapPin className='size-3 shrink-0' aria-hidden='true' />
                  <span className='truncate'>{location}</span>
                </span>
              )}
              {employeeCount && (
                <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <Users className='size-3 shrink-0' aria-hidden='true' />
                  <span>{employeeCount} Employees</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expandable content - uses native <details> for SEO/no-JS support */}
      {hasExpandableContent && (
        <details className='group mb-0'>
          <summary
            className={cn(
              'inline-flex cursor-pointer list-none items-center gap-1',
              'text-xs text-muted-foreground',
              'transition-colors duration-150',
              'hover:text-foreground',
              '[&::-webkit-details-marker]:hidden',
            )}
          >
            <ChevronRight
              className='size-3.5 transition-transform duration-200 group-open:rotate-90'
              aria-hidden='true'
            />
            <span className='group-open:hidden'>View organization details</span>
            <span className='hidden group-open:inline'>
              Hide organization details
            </span>
          </summary>

          <div className='mt-3 space-y-3'>
            {/* Funding rounds - card style */}
            {fundingRounds.length > 0 && (
              <div className='space-y-2'>
                <p className='text-xs font-medium text-muted-foreground'>
                  Funding
                </p>
                <div className='flex flex-wrap gap-2'>
                  {fundingRounds.map((round) => (
                    <Link
                      key={`${round.roundName}-${round.date}`}
                      href={round.href}
                      target='_blank'
                      rel='noopener'
                      className={cn(
                        'flex flex-col rounded-lg px-3 py-2',
                        'bg-muted/50 ring-1 ring-border/50',
                        'transition-all duration-150',
                        'hover:bg-muted hover:ring-border',
                      )}
                    >
                      <span className='text-sm font-medium text-foreground'>
                        {round.roundName}
                      </span>
                      {(round.amount || round.date) && (
                        <span className='text-xs text-muted-foreground'>
                          {[round.amount, round.date]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Investors - badge style */}
            {investors.length > 0 && (
              <div className='mb-2 space-y-2'>
                <p className='text-xs font-medium text-muted-foreground'>
                  Investors
                </p>
                <div className='flex flex-wrap gap-1.5'>
                  {investors.map((investor) => (
                    <Badge key={investor.name} variant='secondary' asChild>
                      <LinkWithLoader href={investor.href}>
                        {investor.name}
                      </LinkWithLoader>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </details>
      )}

      {/* View all jobs link */}
      {/* <LinkWithLoader
        href={href}
        className={cn(
          'inline-flex items-center gap-1',
          'text-xs text-muted-foreground',
          'transition-colors duration-150',
          'hover:text-foreground',
        )}
      >
        <ChevronRight className='size-3.5' aria-hidden='true' />
        View all jobs from {name}
      </LinkWithLoader> */}
    </div>
  );
};
