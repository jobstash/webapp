'use client';

import { LoaderIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { JobstashLogo } from '@/components/jobstash-logo';
import { GA_EVENT, trackEvent } from '@/lib/analytics';

import { useLoginAuth } from './use-login-auth';
import { useLoginContent } from './use-login-content';

export const LoginContent = () => {
  const {
    isNavigating,
    redirectTo,
    destinationReady,
    isBackToHome,
    handleBack: navigateBack,
  } = useLoginContent();
  const {
    login,
    isLoading,
    profileError,
    retryProfile,
    cancelRedirect,
    sessionError,
    retrySession,
  } = useLoginAuth(redirectTo, destinationReady);

  const handleBack = () => {
    cancelRedirect();
    navigateBack();
  };

  if (isLoading) {
    return (
      <div className='flex h-dvh flex-col items-center justify-center gap-5 bg-background'>
        <LoaderIcon
          aria-label='Loading sign-in'
          className='size-6 animate-spin text-muted-foreground'
        />
        {destinationReady && (
          <button
            type='button'
            disabled={isNavigating}
            onClick={handleBack}
            className='text-sm text-muted-foreground underline underline-offset-4'
          >
            Back to {isBackToHome ? 'jobs' : 'previous page'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className='flex min-h-svh items-center justify-center p-4'>
      <div className='flex w-full max-w-sm flex-col items-center gap-6'>
        <div className='flex flex-col items-center gap-3'>
          <JobstashLogo className='size-16' />
          <span
            className={cn(
              'bg-linear-to-r from-[#f5a00d] to-[#8743FF] bg-clip-text',
              'text-3xl font-bold tracking-tight text-transparent',
            )}
          >
            JobStash
          </span>
        </div>

        <div className='flex flex-col items-center gap-1.5 text-center'>
          <h1 className='text-2xl font-semibold text-foreground'>
            Find Your Next Web3 Role
          </h1>
          <p className='text-sm text-muted-foreground'>
            Let&apos;s match you with the best crypto jobs.
          </p>
        </div>

        {sessionError && (
          <p role='alert' className='text-center text-sm text-muted-foreground'>
            We couldn’t finish signing you in. Try again, or return to your
            previous page.
          </p>
        )}
        {profileError && (
          <p role='alert' className='text-center text-sm text-muted-foreground'>
            We couldn’t load your profile. Try again, or return to your previous
            page.
          </p>
        )}

        <div className='w-48 rounded-lg bg-linear-to-r from-[#8743FF] to-[#D68800] p-px'>
          <Button
            size='lg'
            className={cn(
              'w-full gap-3 rounded-[calc(var(--radius-lg)-1px)]',
              'bg-sidebar font-semibold text-white',
              'hover:bg-sidebar/80',
            )}
            onClick={() => {
              if (sessionError) {
                retrySession();
                return;
              }
              if (profileError) {
                retryProfile();
                return;
              }
              trackEvent(GA_EVENT.LOGIN_STARTED, { login_method: 'privy' });
              login();
            }}
          >
            {profileError || sessionError ? 'Try again' : 'Get Started'}
          </Button>
        </div>

        <button
          type='button'
          onClick={handleBack}
          disabled={isNavigating}
          className={cn(
            'text-xs text-muted-foreground/60',
            'underline-offset-4 transition-colors',
            'hover:text-muted-foreground hover:underline',
            'disabled:pointer-events-none disabled:opacity-50',
          )}
        >
          Back to {isBackToHome ? 'jobs' : 'previous page'}
        </button>
      </div>
    </div>
  );
};
