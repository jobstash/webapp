'use client';

import { ArrowLeftIcon } from 'lucide-react';

import { useOnboarding } from '@/features/onboarding/hooks/use-onboarding';

import { AuthButtons } from './auth-buttons';

export const LoginView = () => {
  const { hideLogin } = useOnboarding();

  return (
    <div className='flex flex-col items-center gap-6 text-center sm:gap-8'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-semibold'>Welcome Back</h1>
        <p className='text-muted-foreground'>Log in to your JobStash account</p>
      </div>

      <AuthButtons />

      <div className='flex w-full max-w-xs flex-col items-center gap-3'>
        <div className='h-px w-full bg-border' />
        <button
          type='button'
          className='flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
          onClick={hideLogin}
        >
          <ArrowLeftIcon className='size-3.5' />
          Back to onboarding
        </button>
      </div>
    </div>
  );
};
