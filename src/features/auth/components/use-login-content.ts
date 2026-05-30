'use client';

import { useTransition } from 'react';

import { useRouter } from '@bprogress/next/app';
import { useSearchParams } from 'next/navigation';

export const useLoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();

  const redirectParam = searchParams.get('redirect');
  const redirectTo = redirectParam ?? '/profile/jobs';
  const backTo = redirectParam ?? '/';
  const isBackToHome = backTo === '/';

  const handleBack = () => {
    startTransition(() => {
      router.push(backTo);
    });
  };

  return {
    isNavigating,
    redirectTo,
    isBackToHome,
    handleBack,
  };
};
