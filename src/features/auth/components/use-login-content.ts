'use client';

import { useTransition } from 'react';

import { useRouter } from '@bprogress/next/app';
import { useSearchParams } from 'next/navigation';

export const useLoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();

  const redirectTo = searchParams.get('redirect') ?? '/profile/jobs';

  const handleBack = () => {
    startTransition(() => {
      router.push(redirectTo);
    });
  };

  return {
    isNavigating,
    redirectTo,
    handleBack,
  };
};
