import { ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { LinkWithLoader } from '@/components/link-with-loader';
import { cn } from '@/lib/utils';
import { type JobOrganizationSchema } from '@/features/jobs/schemas';

interface JobListItemOrgProps {
  organization: JobOrganizationSchema;
}

export const JobListItemOrg = ({ organization }: JobListItemOrgProps) => {
  const { fundingRounds, investors } = organization;

  const hasExpandableContent = fundingRounds.length > 0 || investors.length > 0;

  if (!hasExpandableContent) return null;

  return (
    <details className='group'>
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
            <p className='text-xs font-medium text-muted-foreground'>Funding</p>
            <div className='flex flex-wrap gap-2'>
              {fundingRounds.map((round) => {
                const content = (
                  <>
                    <span className='flex items-center gap-1.5 text-sm font-medium text-foreground'>
                      {round.roundName}
                    </span>
                    {(round.amount || round.date) && (
                      <span className='text-xs text-muted-foreground'>
                        {[round.amount, round.date].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </>
                );

                const baseClassName = cn(
                  'flex flex-col items-start gap-0.5 rounded-lg px-3 py-2',
                  'bg-muted/50 ring-1 ring-border/50',
                );

                if (round.href) {
                  return (
                    <LinkWithLoader
                      key={`${round.roundName}-${round.date}`}
                      href={round.href}
                      className={cn(
                        baseClassName,
                        'transition-all duration-150',
                        'hover:bg-muted hover:ring-border',
                      )}
                    >
                      {content}
                    </LinkWithLoader>
                  );
                }

                return (
                  <div
                    key={`${round.roundName}-${round.date}`}
                    className={baseClassName}
                  >
                    {content}
                  </div>
                );
              })}
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
  );
};
