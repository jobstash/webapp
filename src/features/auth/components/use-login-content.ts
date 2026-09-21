'use client';

import { useEffect, useState, useTransition } from 'react';

import { useRouter } from '@bprogress/next/app';
import { useSearchParams } from 'next/navigation';
import {
  safeReturnPath,
  readSignInReturn,
  startSignInReturn,
  markSignInReturn,
} from '../lib/return-navigation';

export const useLoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();

  const redirectParam = searchParams.get('redirect');
  const [destination, setDestination] = useState<{
    href: string;
    ready: boolean;
  }>({ href: '/', ready: false });
  useEffect(() => {
    // HTTP redirects retain fragments, which are not visible to the server guard.
    const safeTarget = safeReturnPath(redirectParam);
    const target = safeReturnPath(
      safeTarget + (safeTarget.includes('#') ? '' : window.location.hash),
    );
    const saved = readSignInReturn();
    if (!saved || saved.href !== target || saved.phase !== 'login')
      startSignInReturn(target);
    setDestination({ href: target, ready: true });
  }, [redirectParam]);
  const redirectTo = destination.href;
  const backTo = redirectTo;
  const isBackToHome = backTo === '/';

  const handleBack = () => {
    startTransition(() => {
      markSignInReturn(backTo, 'returning');
      router.push(backTo, { scroll: false });
    });
  };

  return {
    isNavigating,
    destinationReady: destination.ready,
    redirectTo,
    isBackToHome,
    handleBack,
  };
};
