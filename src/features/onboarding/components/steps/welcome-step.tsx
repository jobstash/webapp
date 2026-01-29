'use client';

import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/features/onboarding/hooks/use-onboarding';

export const WelcomeStep = () => {
  const { nextStep, showLogin } = useOnboarding();

  return (
    <div className='flex flex-col items-center gap-6 text-center sm:gap-8'>
      <span className='bg-gradient-to-r from-[#D68800] to-[#8743FF] bg-clip-text text-3xl font-bold text-transparent'>
        JobStash
      </span>

      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-semibold'>Find Your Next Web3 Role</h1>
        <p className='mx-auto max-w-xs text-muted-foreground'>
          Set up your profile in under a minute. We&apos;ll match you with the
          best crypto jobs.
        </p>
      </div>

      <Button size='lg' className='w-full max-w-xs' onClick={nextStep}>
        Get Started
      </Button>

      <div className='flex w-full max-w-xs flex-col items-center gap-3'>
        <div className='h-px w-full bg-border' />
        <p className='text-sm text-muted-foreground'>
          Already have an account?{' '}
          <button
            type='button'
            className='font-medium text-primary underline-offset-4 hover:underline'
            onClick={showLogin}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};
