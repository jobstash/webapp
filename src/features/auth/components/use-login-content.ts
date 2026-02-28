'use client';

import { useTransition } from 'react';

import { useRouter } from '@bprogress/next/app';
import { useSearchParams } from 'next/navigation';

import { usePrivy } from '@privy-io/react-auth';

export const useLoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();

  const { ready } = usePrivy();

  const redirectTo = searchParams.get('redirect') ?? '/profile/jobs';

  const isLoading = !ready;

  const handleBack = () => {
    startTransition(() => {
      router.push(redirectTo);
    });
  };

  return {
    isLoading,
    isNavigating,
    redirectTo,
    handleBack,
  };
};
