'use client';

import { LoaderIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { LoginView } from './login-view';
import { useOnboardingContent } from './use-onboarding-content';

export const OnboardingContent = () => {
  const {
    steps,
    currentIndex,
    isLoginView,
    isLoading,
    isSyncing,
    isNavigating,
    StepComponent,
    handleClose,
  } = useOnboardingContent();

  if (isLoading || isSyncing) {
    return (
      <div className='flex h-dvh flex-col items-center justify-center gap-3 bg-background'>
        <LoaderIcon className='size-6 animate-spin text-muted-foreground' />
        {isSyncing && (
          <p className='text-sm text-muted-foreground'>
            Setting up your profile...
          </p>
        )}
      </div>
    );
  }

  return (
    <div className='flex h-dvh flex-col bg-background'>
      <div className='flex shrink-0 items-center justify-between px-4 pt-4 pb-2'>
        <div className='size-8' />

        <div className='flex items-center gap-2'>
          {!isLoginView &&
            steps.map((step, index) => (
              <div
                key={step}
                className={cn(
                  'size-2.5 rounded-full transition-colors',
                  index < currentIndex && 'bg-primary/50',
                  index === currentIndex && 'bg-primary',
                  index > currentIndex && 'bg-muted-foreground/30',
                )}
              />
            ))}
        </div>

        <Button
          variant='ghost'
          size='icon'
          disabled={isNavigating}
          onClick={handleClose}
          aria-label='Close'
        >
          <XIcon className='size-4' />
        </Button>
      </div>

      <div className='flex flex-1 items-center justify-center overflow-y-auto px-4 py-6 sm:px-6'>
        <div className='-mt-[60px] w-full max-w-lg sm:mt-0'>
          {isLoginView ? <LoginView /> : <StepComponent />}
        </div>
      </div>
    </div>
  );
};
