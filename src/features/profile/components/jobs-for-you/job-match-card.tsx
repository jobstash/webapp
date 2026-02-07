'use client';

import { BriefcaseIcon, FlameIcon, SparklesIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LinkWithLoader } from '@/components/link-with-loader';
import type { MatchedJob } from '@/features/profile/hooks/use-jobs-for-you';

const BADGE_BASE = 'rounded-md border-transparent py-0.5 tracking-wide';

const MATCH_BADGES = {
  strong_fit: {
    label: 'Strong Match',
    icon: FlameIcon,
    iconClass: 'text-emerald-500',
    badgeClass: cn(
      'bg-linear-to-r from-emerald-500/15 to-green-500/15',
      'text-emerald-600 dark:text-emerald-400',
      'ring-1 ring-emerald-500/25',
    ),
  },
  partial_fit: {
    label: 'Good Match',
    icon: SparklesIcon,
    iconClass: 'text-sky-500',
    badgeClass: cn(
      'bg-linear-to-r from-sky-500/10 to-cyan-500/10',
      'text-sky-600 dark:text-sky-400',
      'ring-1 ring-sky-500/20',
    ),
  },
} as const;

interface JobMatchCardProps {
  job: MatchedJob;
}

export const JobMatchCard = ({ job }: JobMatchCardProps) => {
  const matchBadge =
    job.match.category in MATCH_BADGES
      ? MATCH_BADGES[job.match.category as keyof typeof MATCH_BADGES]
      : null;

  const Icon = matchBadge?.icon ?? SparklesIcon;

  return (
    <LinkWithLoader
      href={`/jobs/${job.shortUuid}`}
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border p-3',
        'transition-colors hover:bg-accent/50',
      )}
    >
      <div className='flex size-9 shrink-0 items-center justify-center rounded-md bg-accent'>
        <BriefcaseIcon className='size-4 text-muted-foreground' />
      </div>
      <div className='flex min-w-0 grow flex-col gap-0.5'>
        <span className='truncate text-sm font-medium'>{job.title}</span>
        {job.orgName && (
          <span className='truncate text-xs text-muted-foreground'>
            {job.orgName}
          </span>
        )}
      </div>
      {matchBadge && (
        <Badge
          variant='outline'
          className={cn(BADGE_BASE, matchBadge.badgeClass, 'shrink-0')}
        >
          <Icon className={cn('size-3', matchBadge.iconClass)} />
          {matchBadge.label}
        </Badge>
      )}
    </LinkWithLoader>
  );
};
