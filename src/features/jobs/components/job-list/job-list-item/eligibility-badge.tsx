'use client';

import { ArrowRightIcon, FlameIcon, SparklesIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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

interface EligibilityBadgeProps {
  jobId: string;
}

export const EligibilityBadge = ({ jobId }: EligibilityBadgeProps) => {
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

  if (isLoading) return null;

  if (!match || !(match.category in MATCH_BADGES)) return null;
  const config = MATCH_BADGES[match.category as keyof typeof MATCH_BADGES];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant='outline' className={cn(BADGE_BASE, config.badgeClass)}>
          <config.icon className={cn('size-3', config.iconClass)} />
          {config.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{config.tooltip}</TooltipContent>
    </Tooltip>
  );
};
