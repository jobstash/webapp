'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from '@bprogress/next/app';
import { useSearchParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { useLinkAccount, usePrivy } from '@privy-io/react-auth';

import { JOB_APPLY_STATUS_KEY } from '@/features/jobs/components/job-details/use-job-apply-status';
import { LINKED_ACCOUNTS_QUERY_KEY } from '@/features/profile/hooks/use-linked-accounts';

const PROVIDERS = ['github', 'google', 'email'] as const;
type Provider = (typeof PROVIDERS)[number];

const isValidProvider = (value: string | null): value is Provider =>
  PROVIDERS.includes(value as Provider);

export const useLinkAccountContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const isLinkInitiated = useRef(false);

  const queryClient = useQueryClient();
  const { ready, authenticated, user } = usePrivy();

  const { linkGithub, linkGoogle, linkEmail } = useLinkAccount({
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

  const linkFnRef = useRef<Record<Provider, () => void>>({
    github: linkGithub,
    google: linkGoogle,
    email: linkEmail,
  });
  linkFnRef.current = {
    github: linkGithub,
    google: linkGoogle,
    email: linkEmail,
  };

  const provider = searchParams.get('provider');

  const hasOAuthParams =
    typeof window !== 'undefined' &&
    /[?&]privy_oauth_/.test(window.location.search);

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      router.replace('/profile');
      return;
    }

    if (!isValidProvider(provider)) {
      router.replace('/profile');
      return;
    }

    if (user?.[provider]) {
      router.replace('/profile');
      return;
    }

    if (hasOAuthParams) return;

    if (isLinkInitiated.current) return;
    isLinkInitiated.current = true;

    linkFnRef.current[provider]();
  }, [ready, authenticated, user, provider, hasOAuthParams, router]);

  const isLoading = !error;

  return { isLoading, error };
};
