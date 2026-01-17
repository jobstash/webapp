'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Users,
  Landmark,
  Coins,
} from 'lucide-react';

import { type JobOrganizationSchema } from '@/features/jobs/schemas';

interface JobListItemOrgProps {
  organization: JobOrganizationSchema;
}

export const JobListItemOrg = ({ organization }: JobListItemOrgProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
      {/* Collapsed row */}
      <div className='flex items-center gap-2'>
        {logo ? (
          <Image
            src={logo}
            alt={`${name} logo`}
            width={36}
            height={36}
            className='rounded-md'
          />
        ) : (
          <div className='flex size-9 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground'>
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className='flex flex-1 items-center gap-1.5 text-sm'>
          <Link href={href} className='font-medium hover:underline'>
            {name}
          </Link>

          {websiteUrl && (
            <a
              href={websiteUrl}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`Visit ${name} website`}
              className='text-muted-foreground hover:text-foreground'
            >
              <ExternalLink className='size-3.5' aria-hidden='true' />
            </a>
          )}

          {location && (
            <>
              <span className='text-muted-foreground'>·</span>
              <span className='text-muted-foreground'>{location}</span>
            </>
          )}
        </div>

        {hasExpandableContent && (
          <button
            type='button'
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={
              isExpanded
                ? 'Collapse organization details'
                : 'Expand organization details'
            }
            className='rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
          >
            {isExpanded ? (
              <ChevronUp className='size-4' aria-hidden='true' />
            ) : (
              <ChevronDown className='size-4' aria-hidden='true' />
            )}
          </button>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && hasExpandableContent && (
        <div className='ml-11 space-y-1.5 text-sm'>
          {employeeCount && (
            <div className='flex items-center gap-1.5 text-muted-foreground'>
              <Users className='size-3.5' />
              <span>{employeeCount} employees</span>
            </div>
          )}

          {fundingRounds.map((round) => (
            <div key={round.roundName} className='flex items-center gap-1.5'>
              <Coins className='size-3.5 text-muted-foreground' />
              <Link
                href={round.href}
                className='text-foreground hover:underline'
              >
                {round.roundName}
              </Link>
              {round.amount && (
                <span className='text-muted-foreground'>· {round.amount}</span>
              )}
              {round.date && (
                <span className='text-muted-foreground'>· {round.date}</span>
              )}
            </div>
          ))}

          {investors.length > 0 && (
            <div className='flex items-center gap-1.5'>
              <Landmark className='size-3.5 text-muted-foreground' />
              <div className='flex flex-wrap items-center gap-1'>
                {investors.slice(0, 3).map((investor, i) => (
                  <span key={investor.name}>
                    <Link
                      href={investor.href}
                      className='text-foreground hover:underline'
                    >
                      {investor.name}
                    </Link>
                    {i < Math.min(investors.length, 3) - 1 && (
                      <span className='text-muted-foreground'>,</span>
                    )}
                  </span>
                ))}
                {investors.length > 3 && (
                  <span className='text-muted-foreground'>
                    +{investors.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
