import Link from 'next/link';
import { ExternalLinkIcon, MapPinIcon, UsersIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LinkWithLoader } from '@/components/link-with-loader';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { type JobOrganizationSchema } from '@/features/jobs/schemas';

interface OrgInfoCardProps {
  organization: JobOrganizationSchema;
}

export const OrgInfoCard = ({ organization }: OrgInfoCardProps) => {
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

  return (
    <div className='space-y-4 rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
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
                'text-sm font-medium text-muted-foreground',
                'ring-1 ring-border/50',
              )}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          }
        />
        <div className='flex items-center gap-2'>
          <span className='font-medium text-foreground'>{name}</span>
          {websiteUrl && (
            <Link
              href={websiteUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              <ExternalLinkIcon className='size-3.5' />
            </Link>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        {location && (
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <MapPinIcon className='size-4' />
            <span>{location}</span>
          </div>
        )}
        {employeeCount && (
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <UsersIcon className='size-4' />
            <span>{employeeCount} Employees</span>
          </div>
        )}
      </div>

      {fundingRounds.length > 0 && (
        <div className='space-y-2'>
          <p className='text-xs font-medium text-muted-foreground'>Funding</p>
          <div className='flex flex-wrap gap-1.5'>
            {fundingRounds.slice(0, 3).map((round) => {
              const label = round.amount
                ? `${round.roundName} (${round.amount})`
                : round.roundName;

              return round.href ? (
                <Badge
                  key={`${round.roundName}-${round.date}`}
                  variant='secondary'
                  className='py-1 text-foreground/70 hover:text-foreground'
                >
                  <LinkWithLoader href={round.href}>{label}</LinkWithLoader>
                </Badge>
              ) : (
                <Badge key={round.roundName} variant='secondary'>
                  {label}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {investors.length > 0 && (
        <div className='space-y-2'>
          <p className='text-xs font-medium text-muted-foreground'>Investors</p>
          <div className='flex flex-wrap gap-1.5'>
            {investors.slice(0, 5).map((investor) => (
              <Badge
                key={investor.name}
                variant='secondary'
                className='py-1 text-foreground/70 hover:text-foreground'
                asChild
              >
                <LinkWithLoader href={investor.href}>
                  {investor.name}
                </LinkWithLoader>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Button variant='secondary' asChild className='w-full'>
        <LinkWithLoader href={href}>View jobs by {name}</LinkWithLoader>
      </Button>
    </div>
  );
};
