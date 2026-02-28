'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from '@bprogress/next/app';
import { useSearchParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { useLinkAccount, usePrivy } from '@privy-io/react-auth';

import { JOB_APPLY_STATUS_KEY } from '@/features/jobs/components/job-details/use-job-apply-status';
import { LINKED_ACCOUNTS_QUERY_KEY } from '@/features/profile/hooks/use-linked-accounts';

export const useLinkAccountContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const isLinkInitiated = useRef(false);

  const queryClient = useQueryClient();
  const { ready, authenticated } = usePrivy();

  const provider = searchParams.get('provider');

  const { linkEmail } = useLinkAccount({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LINKED_ACCOUNTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [JOB_APPLY_STATUS_KEY] });
      router.replace('/profile');
    },
    onError: (errorCode) => {
      setError(
        String(errorCode) || 'Failed to link account. Please try again.',
      );
    },
  });

  useEffect(() => {
    if (!ready) return;

    // Only email uses the /link page for initiation (modal-based, no redirect).
    // OAuth providers (github, google) are initiated directly from the profile
    // page via click handlers. If someone lands here for those providers, just
    // redirect to profile.
    if (provider !== 'email') {
      router.replace('/profile');
      return;
    }

    if (!authenticated) return;
    if (isLinkInitiated.current) return;
    isLinkInitiated.current = true;

    linkEmail();

    return () => {
      isLinkInitiated.current = false;
    };
  }, [ready, authenticated, provider, router, linkEmail]);

  const isLoading = !error;

  return { isLoading, error };
};
