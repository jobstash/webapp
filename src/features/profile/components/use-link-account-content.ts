'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from '@bprogress/next/app';
import { useSearchParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { useLinkAccount, usePrivy } from '@privy-io/react-auth';

import { LINKED_ACCOUNTS_QUERY_KEY } from '@/features/profile/hooks/use-linked-accounts';

const OAUTH_PROVIDERS = ['github', 'google'] as const;
type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

const isValidProvider = (value: string | null): value is OAuthProvider =>
  OAUTH_PROVIDERS.includes(value as OAuthProvider);

/** Key on Privy's `user` object that indicates whether the provider is already linked. */
const PROVIDER_KEY: Record<OAuthProvider, 'github' | 'google'> = {
  github: 'github',
  google: 'google',
};

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

  // Detect OAuth return via URL params (matches login flow pattern)
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

    // Already linked — safety-net redirect
    if (user?.[PROVIDER_KEY[provider]]) {
      router.replace('/profile');
      return;
    }

    // Privy is processing the OAuth callback — wait for onSuccess
    if (hasOAuthParams) return;

    // Prevent double-initiation on strict-mode remount
    if (isLinkInitiated.current) return;
    isLinkInitiated.current = true;

    linkFnRef.current[provider]();
  }, [ready, authenticated, user, provider, hasOAuthParams, router]);

  const isLoading = !error;

  return { isLoading, error };
};
