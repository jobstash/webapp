'use client';

import { ArrowRightIcon, SparklesIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { type CtaType, COMPLETENESS_ITEMS } from '@/features/profile/constants';
import { useProfileCompleteness } from '@/features/profile/hooks/use-profile-completeness';

import { useProfileEditor } from './profile-editor-provider';

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

const useCtaAction = () => {
  const {
    openSkillsEditor,
    openResumeUpload,
    openContactInfoEditor,
    openSocialsEditor,
  } = useProfileEditor();

  return (ctaType: CtaType) => {
    const actions: Record<CtaType, () => void> = {
      'skills-editor': openSkillsEditor,
      'resume-upload': openResumeUpload,
      'contact-info-editor': openContactInfoEditor,
      'socials-editor': openSocialsEditor,
    };
    actions[ctaType]();
  };
};

const DesktopSkeleton = () => (
  <div className='hidden flex-col gap-3 lg:flex'>
    <div className='flex items-center justify-between'>
      <Skeleton className='h-3.5 w-24' />
      <Skeleton className='h-4 w-10' />
    </div>
    <Skeleton className='h-1.5 w-full rounded-full' />
    <div className='flex flex-col gap-1'>
      <Skeleton className='h-4 w-16' />
      <Skeleton className='h-3 w-40' />
    </div>
    <Skeleton className='h-16 w-full rounded-lg' />
  </div>
);

const MobileSkeleton = () => (
  <div className='flex flex-col gap-2 lg:hidden'>
    <div className='flex items-center justify-between'>
      <Skeleton className='h-4 w-16' />
      <Skeleton className='h-3 w-10' />
    </div>
    <Skeleton className='h-1.5 w-full rounded-full' />
    <div className='flex items-center justify-between'>
      <Skeleton className='h-4 w-32' />
      <Skeleton className='h-8 w-24 rounded-md' />
    </div>
  </div>
);

export const ProfileStrengthCard = () => {
  const { isPending, tier, completedCount, nextStep } =
    useProfileCompleteness();
  const handleCta = useCtaAction();

  const isComplete = completedCount === TOTAL_ITEMS;

  if (isPending) {
    return (
      <div className='flex flex-col gap-3 rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
        <DesktopSkeleton />
        <MobileSkeleton />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3 rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
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
            <button
              type='button'
              className='group block w-full text-left'
              onClick={() => handleCta(nextStep.ctaType)}
            >
              <div className='flex flex-col gap-1.5 rounded-lg bg-accent/50 p-3 transition-colors group-hover:bg-accent'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>
                    Next: {nextStep.label}
                  </span>
                  <ArrowRightIcon className='size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
                </div>
                <span className='text-xs text-muted-foreground'>
                  {nextStep.unlocks}
                </span>
              </div>
            </button>
          )
        )}
      </div>

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
            <div className='flex items-center justify-between gap-2'>
              <span className='min-w-0 truncate text-sm font-medium'>
                Next: {nextStep.label}
              </span>
              <Button
                size='sm'
                variant='secondary'
                className='shrink-0'
                onClick={() => handleCta(nextStep.ctaType)}
              >
                {nextStep.action}
                <ArrowRightIcon className='size-3' />
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
