import { LinkWithLoader } from '@/components/link-with-loader';
import {
  ChevronDown,
  ExternalLink,
  Users,
  Landmark,
  Coins,
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

  const hasExpandableContent =
    employeeCount || fundingRounds.length > 0 || investors.length > 0;

  return (
    <div className='space-y-2'>
      {/* Organization header */}
      <div className='flex items-center gap-2'>
        <ImageWithFallback
          src={logo ?? ''}
          alt={`${name} logo`}
          width={36}
          height={36}
          className='rounded-md'
          fallback={
            <div className='flex size-9 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground'>
              {name.charAt(0).toUpperCase()}
            </div>
          }
        />

        <div className='flex flex-1 items-center gap-1.5 text-sm'>
          <LinkWithLoader href={href} className='font-medium hover:underline'>
            {name}
          </LinkWithLoader>

          {websiteUrl && (
            <LinkWithLoader
              href={websiteUrl}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Visit website'
              className='text-muted-foreground hover:text-foreground'
            >
              <ExternalLink className='size-3.5' aria-hidden='true' />
            </LinkWithLoader>
          )}

          {location && (
            <>
              <span className='text-muted-foreground'>·</span>
              <span className='text-muted-foreground'>{location}</span>
            </>
          )}
        </div>
      </div>

      {/* Expandable content - uses native <details> for SEO/no-JS support */}
      {hasExpandableContent && (
        <details className='group ml-11'>
          <summary
            className={cn(
              'flex cursor-pointer list-none items-center gap-1 text-sm text-muted-foreground',
              'hover:text-foreground [&::-webkit-details-marker]:hidden',
            )}
          >
            <ChevronDown
              className='size-4 transition-transform group-open:rotate-180'
              aria-hidden='true'
            />
            <span>Organization details</span>
          </summary>

          <div className='mt-2 space-y-1.5 text-sm'>
            {employeeCount && (
              <div className='flex items-center gap-1.5 text-muted-foreground'>
                <Users className='size-3.5' />
                <span>{employeeCount} employees</span>
              </div>
            )}

            {fundingRounds.map((round) => (
              <div
                key={`${round.roundName}-${round.date}`}
                className='flex items-center gap-1.5'
              >
                <Coins className='size-3.5 text-muted-foreground' />
                <LinkWithLoader
                  href={round.href}
                  className='text-foreground hover:underline'
                >
                  {round.roundName}
                </LinkWithLoader>
                {round.amount && (
                  <span className='text-muted-foreground'>
                    · {round.amount}
                  </span>
                )}
                {round.date && (
                  <span className='text-muted-foreground'>· {round.date}</span>
                )}
              </div>
            ))}

            {investors.length > 0 && (
              <div className='flex items-start gap-1.5'>
                <Landmark className='mt-0.5 size-3.5 shrink-0 text-muted-foreground' />
                <div className='flex flex-wrap items-center gap-x-1'>
                  {investors.map((investor, i) => (
                    <span key={investor.name}>
                      <LinkWithLoader
                        href={investor.href}
                        className='text-foreground hover:underline'
                      >
                        {investor.name}
                      </LinkWithLoader>
                      {i < investors.length - 1 && (
                        <span className='text-muted-foreground'>,</span>
                      )}
                    </span>
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
