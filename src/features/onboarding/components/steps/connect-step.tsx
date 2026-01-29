'use client';

import { ArrowLeftIcon, ShieldCheckIcon } from 'lucide-react';

import { AuthButtons } from '@/features/onboarding/components/auth-buttons';
import { useOnboarding } from '@/features/onboarding/hooks/use-onboarding';

export const ConnectStep = () => {
  const { prevStep } = useOnboarding();

  return (
    <div className='flex flex-col gap-6 sm:gap-8'>
      <section className='flex flex-col items-center gap-6 text-center'>
        <div className='rounded-full border border-border bg-muted p-3'>
          <ShieldCheckIcon className='size-6 text-muted-foreground' />
        </div>

        <div className='flex flex-col gap-2'>
          <h2 className='text-xl font-semibold'>Connect Your Account</h2>
          <p className='text-muted-foreground'>
            Sign in to your profile and unlock personalized job matches.
          </p>
        </div>

        <AuthButtons />
      </section>

      <div className='flex flex-col items-center gap-3'>
        <div className='h-px w-full max-w-xs bg-border' />
        <button
          type='button'
          className='flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
          onClick={prevStep}
        >
          <ArrowLeftIcon className='size-3.5' />
          Back to profile setup
        </button>
      </div>
    </div>
  );
};
