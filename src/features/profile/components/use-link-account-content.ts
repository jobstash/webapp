'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from '@bprogress/next/app';
import { useSearchParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { useLinkAccount, usePrivy } from '@privy-io/react-auth';

import { JOB_APPLY_STATUS_KEY } from '@/features/jobs/components/job-details/use-job-apply-status';
import { LINKED_ACCOUNTS_QUERY_KEY } from '@/features/profile/hooks/use-linked-accounts';

const OAUTH_PROVIDERS = ['github', 'google'] as const;
type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

const isValidProvider = (value: string | null): value is OAuthProvider =>
  OAUTH_PROVIDERS.includes(value as OAuthProvider);

export const useLinkAccountContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const isLinkInitiated = useRef(false);

  const queryClient = useQueryClient();
  const { ready, authenticated, user } = usePrivy();

  const { linkGithub, linkGoogle } = useLinkAccount({
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

  const linkFnRef = useRef<Record<OAuthProvider, () => void>>({
    github: linkGithub,
    google: linkGoogle,
  });
  linkFnRef.current = { github: linkGithub, google: linkGoogle };

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
