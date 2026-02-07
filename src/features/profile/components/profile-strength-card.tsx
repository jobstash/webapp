'use client';

import { ArrowRightIcon, SparklesIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { LinkWithLoader } from '@/components/link-with-loader';
import { COMPLETENESS_ITEMS } from '@/features/profile/constants';
import { useProfileCompleteness } from '@/features/profile/hooks/use-profile-completeness';

const TOTAL_ITEMS = COMPLETENESS_ITEMS.length;

const ProgressBar = ({
  completedCount,
  bgColor,
}: {
  completedCount: number;
  bgColor: string;
}) => (
  <div className='h-1.5 w-full rounded-full bg-neutral-800'>
    <div
      className={cn(
        'h-full rounded-full transition-all duration-500 ease-out',
        bgColor,
      )}
      style={{ width: `${(completedCount / TOTAL_ITEMS) * 100}%` }}
    />
  </div>
);

const CompleteBadge = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'flex items-center gap-2 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20',
      className,
    )}
  >
    <SparklesIcon className='size-4 shrink-0 text-emerald-500' />
    <span className='text-sm font-medium text-emerald-400'>
      Profile complete
    </span>
  </div>
);

export const ProfileStrengthCard = () => {
  const { tier, completedCount, nextStep } = useProfileCompleteness();

  const isComplete = completedCount === TOTAL_ITEMS;

  return (
    <div className='flex flex-col gap-3 rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      {/* Desktop */}
      <div className='hidden flex-col gap-3 lg:flex'>
        <h3 className='font-medium'>Profile Strength</h3>

        <div className='flex items-center justify-between'>
          <span
            className={cn(
              'text-sm font-bold tracking-wide uppercase',
              tier.color,
            )}
          >
            {tier.name}
          </span>
          <span className='text-sm font-semibold tabular-nums'>
            {completedCount} of {TOTAL_ITEMS}
          </span>
        </div>

        <ProgressBar completedCount={completedCount} bgColor={tier.bgColor} />

        <span className='text-xs text-muted-foreground'>{tier.message}</span>

        {isComplete ? (
          <CompleteBadge className='p-3' />
        ) : (
          nextStep && (
            <LinkWithLoader href={nextStep.href} className='group block w-full'>
              <div className='flex items-center gap-2 rounded-lg bg-accent/50 p-3 transition-colors group-hover:bg-accent'>
                <span className='text-sm font-medium'>
                  Next: {nextStep.label}
                </span>
                <ArrowRightIcon className='ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
              </div>
            </LinkWithLoader>
          )
        )}
      </div>

      {/* Mobile */}
      <div className='flex flex-col gap-2 lg:hidden'>
        <div className='flex items-center justify-between'>
          <span
            className={cn(
              'text-sm font-bold tracking-wide uppercase',
              tier.color,
            )}
          >
            {tier.name}
          </span>
          <span className='text-xs text-muted-foreground tabular-nums'>
            {completedCount} of {TOTAL_ITEMS}
          </span>
        </div>

        <ProgressBar completedCount={completedCount} bgColor={tier.bgColor} />

        {isComplete ? (
          <CompleteBadge className='p-2.5' />
        ) : (
          nextStep && (
            <LinkWithLoader href={nextStep.href} className='group block w-full'>
              <div className='flex items-center gap-2 rounded-lg bg-accent/50 p-2.5 transition-colors group-hover:bg-accent'>
                <span className='min-w-0 truncate text-sm font-medium'>
                  Next: {nextStep.label}
                </span>
                <ArrowRightIcon className='ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
              </div>
            </LinkWithLoader>
          )
        )}
      </div>
    </div>
  );
};
