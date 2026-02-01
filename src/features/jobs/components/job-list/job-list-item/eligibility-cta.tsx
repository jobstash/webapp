'use client';

import { ArrowRightIcon, FlameIcon, SparklesIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LinkWithLoader } from '@/components/link-with-loader';
import { useEligibility } from '@/hooks/use-eligibility';

const BADGE_BASE = 'rounded-md border-transparent py-1 tracking-wide';

export const EligibilityCta = () => {
  const { isAuthenticated, isExpert, isLoading } = useEligibility();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return (
      <Badge
        asChild
        variant='outline'
        className={cn(
          BADGE_BASE,
          'bg-gradient-to-r from-teal-500/10 to-emerald-500/10',
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

  if (isExpert) {
    return (
      <Badge
        variant='outline'
        className={cn(
          BADGE_BASE,
          'bg-gradient-to-r from-violet-500/15 to-purple-500/15',
          'text-violet-600 dark:text-violet-400',
          'ring-1 ring-violet-500/25',
        )}
      >
        <FlameIcon className='size-3 text-orange-500' />
        Strong candidate
      </Badge>
    );
  }

  return (
    <Badge
      asChild
      variant='outline'
      className={cn(
        BADGE_BASE,
        'bg-gradient-to-r from-amber-500/10 to-yellow-500/10',
        'text-amber-600 dark:text-amber-400',
        'ring-1 ring-amber-500/15',
        'cursor-pointer transition-all duration-200',
        'hover:from-amber-500/15 hover:to-yellow-500/15 hover:ring-amber-500/25',
      )}
    >
      <LinkWithLoader href='/profile'>
        Almost eligible
        <ArrowRightIcon className='size-3' />
      </LinkWithLoader>
    </Badge>
  );
};
