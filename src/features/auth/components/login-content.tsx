'use client';

import { useEffect, useState } from 'react';

import { useRouter } from '@bprogress/next/app';
import { LoaderIcon } from 'lucide-react';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { JobstashLogo } from '@/components/jobstash-logo';
import { SESSION_KEY } from '@/features/auth/constants';
import { useSession } from '@/features/auth/hooks/use-session';
import { createSession } from '@/features/auth/lib/create-session';

import { useLoginContent } from './use-login-content';

export const LoginContent = () => {
  const { isNavigating, redirectTo, handleBack } = useLoginContent();
  const { isAuthenticated, isLoading: isSessionLoading } = useSession();

  const router = useRouter();
  const queryClient = useQueryClient();
  const { getAccessToken } = usePrivy();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirect when useSession resolves as authenticated
  // (covers: valid iron-session, OR silent renewal from Privy)
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  const { login } = useLogin({
    onComplete: async ({ wasAlreadyAuthenticated, loginMethod }) => {
      // If already authenticated, invalidate session query to trigger
      // useSession's silent renewal — it will set isAuthenticated,
      // which triggers the redirect effect above.
      if (wasAlreadyAuthenticated) {
        queryClient.invalidateQueries({ queryKey: SESSION_KEY });
        return;
      }

      setIsLoggingIn(true);

      try {
        trackEvent(GA_EVENT.LOGIN_COMPLETED, {
          login_method: loginMethod ?? 'unknown',
        });

        const privyToken = await getAccessToken();
        if (!privyToken) throw new Error('No Privy access token');

        const session = await createSession(privyToken, loginMethod);
        queryClient.setQueryData(SESSION_KEY, session);
      } catch {
        setIsLoggingIn(false);
      }
    },
    onError: () => {
      setIsLoggingIn(false);
    },
  });

  if (isSessionLoading || isAuthenticated || isLoggingIn) {
    return (
      <div className='flex h-dvh flex-col items-center justify-center bg-background'>
        <LoaderIcon className='size-6 animate-spin text-muted-foreground' />
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

        <div className='w-48 rounded-lg bg-linear-to-r from-[#8743FF] to-[#D68800] p-px'>
          <Button
            size='lg'
            className={cn(
              'w-full gap-3 rounded-[calc(var(--radius-lg)-1px)]',
              'bg-sidebar font-semibold text-white',
              'hover:bg-sidebar/80',
            )}
            onClick={() => login()}
          >
            Get Started
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
          Back to {redirectTo === '/' ? 'jobs' : 'previous page'}
        </button>
      </div>
    </div>
  );
};
