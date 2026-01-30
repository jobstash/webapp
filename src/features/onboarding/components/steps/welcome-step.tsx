'use client';

import { JobstashLogo } from '@/components/jobstash-logo';
import { PrimaryCTA } from '@/components/primary-cta';
import { useOnboarding } from '@/features/onboarding/hooks/use-onboarding';

export const WelcomeStep = () => {
  const { nextStep, showLogin } = useOnboarding();

  return (
    <div className='flex flex-col items-center gap-6 text-center sm:gap-8'>
      <div className='flex flex-col items-center gap-2'>
        <JobstashLogo className='size-10 shrink-0 md:size-16' />
        <span className='bg-linear-to-r from-[#f5a00d] to-[#8743FF] bg-clip-text text-3xl font-semibold text-transparent'>
          JobStash
        </span>
      </div>

      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-semibold'>Find Your Next Web3 Role</h1>
        <p className='mx-auto max-w-xs text-muted-foreground'>
          Let&apos;s match you with the best crypto jobs.
        </p>
      </div>

      <PrimaryCTA onClick={nextStep}>See Matching Roles</PrimaryCTA>

      <div className='flex w-full max-w-xs flex-col items-center gap-3'>
        <div className='h-px w-full bg-border' />
        <p className='text-sm text-muted-foreground'>
          Already have an account?{' '}
          <button
            type='button'
            className='ml-1 font-medium text-primary underline-offset-4 hover:underline'
            onClick={showLogin}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};
