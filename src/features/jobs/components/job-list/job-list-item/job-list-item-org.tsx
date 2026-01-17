import Link from 'next/link';

import { LinkWithLoader } from '@/components/link-with-loader';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  ExternalLinkIcon,
  LandmarkIcon,
  UsersIcon,
} from 'lucide-react';

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

  const tagStyles = cn(
    'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1',
    'bg-muted/50 text-xs text-muted-foreground',
    'ring-1 ring-border/50',
  );

  const linkTagStyles = cn(
    tagStyles,
    'transition-all duration-150',
    'hover:bg-muted hover:text-foreground hover:ring-border',
  );

  return (
    <div className='space-y-2'>
      <div className='flex flex-wrap items-center gap-4'>
        {/* Logo + Name/Location */}
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

          <div className='flex flex-col gap-0.5'>
            {websiteUrl ? (
              <Link
                href={websiteUrl}
                target='_blank'
                rel='noopener'
                // oxlint-disable-next-line aria-proptypes
                aria-label={`Visit ${name} website`}
                className={cn(
                  'flex items-center gap-1',
                  'font-bold text-foreground/90',
                  'transition-colors duration-150',
                  'hover:text-primary hover:underline',
                )}
              >
                <span className='truncate'>{name}</span>
              </Link>
            ) : (
              <span className='truncate text-sm font-medium text-foreground'>
                {name}
              </span>
            )}
          </div>
        </div>

        {/* Location */}
        {location && (
          <span className={tagStyles}>
            <LandmarkIcon className='size-3.5 shrink-0' aria-hidden='true' />
            {location}
          </span>
        )}

        {/* Employees */}
        {employeeCount && (
          <span className={tagStyles}>
            <UsersIcon className='size-3.5 shrink-0' aria-hidden='true' />
            {employeeCount} Employees
          </span>
        )}

        {/* Jobs link */}
        <LinkWithLoader href={href} className={linkTagStyles}>
          <ExternalLinkIcon className='size-3.5 shrink-0' aria-hidden='true' />
          Jobs by {name}
        </LinkWithLoader>
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

          <div className='mt-3 space-y-3 pl-4'>
            {/* Funding rounds - card style */}
            {fundingRounds.length > 0 && (
              <div className='space-y-2'>
                <p className='text-xs font-medium text-muted-foreground'>
                  Funding
                </p>
                <div className='flex flex-wrap gap-2'>
                  {fundingRounds.map((round) => (
                    <LinkWithLoader
                      key={`${round.roundName}-${round.date}`}
                      href={round.href}
                      className={cn(
                        'flex flex-col items-start gap-0.5 rounded-lg px-3 py-2',
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
                    </LinkWithLoader>
                  ))}
                </div>
              </div>
            )}

            {/* Investors - badge style */}
            {investors.length > 0 && (
              <div className='space-y-2 pb-2'>
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
    </div>
  );
};
