'use client';

import { ArrowRightIcon, FlameIcon, SparklesIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LinkWithLoader } from '@/components/link-with-loader';

import { useJobMatch } from './use-job-match';

const BADGE_BASE = 'rounded-md border-transparent py-1 tracking-wide';

const MATCH_BADGES = {
  strong_fit: {
    label: 'Strong Match',
    tooltip: 'Your profile is an excellent match for this role!',
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
    tooltip: 'Your profile overlaps with what this role is looking for',
    icon: SparklesIcon,
    iconClass: 'text-sky-500',
    badgeClass: cn(
      'bg-linear-to-r from-sky-500/10 to-cyan-500/10',
      'text-sky-600 dark:text-sky-400',
      'ring-1 ring-sky-500/20',
    ),
  },
} as const;

interface EligibilityCtaProps {
  jobId: string;
}

export const EligibilityCta = ({ jobId }: EligibilityCtaProps) => {
  const { isAuthenticated, isLoading, match } = useJobMatch(jobId);

  if (!isAuthenticated && !isLoading) {
    return (
      <Badge
        asChild
        variant='outline'
        className={cn(
          BADGE_BASE,
          'bg-linear-to-r from-teal-500/10 to-emerald-500/10',
          'text-teal-600 dark:text-teal-400',
          'ring-1 ring-teal-500/20',
          'cursor-pointer transition-all duration-200',
          'hover:from-teal-500/20 hover:to-emerald-500/20 hover:ring-teal-500/30',
        )}
      >
        <LinkWithLoader href='/onboarding'>
          <SparklesIcon className='size-3' />
          Check eligibility
          <ArrowRightIcon className='size-3' />
        </LinkWithLoader>
      </Badge>
    );
  }

  if (isLoading) {
    return <Skeleton className='h-6 w-24 rounded-md' />;
  }

  const matchBadge =
    match && match.category in MATCH_BADGES
      ? MATCH_BADGES[match.category as keyof typeof MATCH_BADGES]
      : null;
  if (!matchBadge) return null;

  const Icon = matchBadge.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant='outline'
          className={cn(BADGE_BASE, matchBadge.badgeClass)}
        >
          <Icon className={cn('size-3', matchBadge.iconClass)} />
          {matchBadge.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{matchBadge.tooltip}</TooltipContent>
    </Tooltip>
  );
};
