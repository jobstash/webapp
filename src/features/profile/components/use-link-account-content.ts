'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from '@bprogress/next/app';
import { useSearchParams } from 'next/navigation';

import { useLinkAccount, usePrivy } from '@privy-io/react-auth';

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

  const { ready, authenticated, user } = usePrivy();

  const { linkGithub, linkGoogle } = useLinkAccount({
    onSuccess: () => {
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

  // Detect returning from OAuth provider (Phase 2)
  const hasOAuthParams =
    typeof window !== 'undefined' &&
    /[?&]privy_oauth_/.test(window.location.search);

  // Phase 1: Initiate the link flow
  useEffect(() => {
    // Phase 2 is handled by Privy SDK automatically — just wait for callbacks
    if (hasOAuthParams) return;

    // Wait for SDK to be ready
    if (!ready) return;

    // Not authenticated — redirect to profile (AuthGuard handles login redirect)
    if (!authenticated) {
      router.replace('/profile');
      return;
    }

    // Invalid or missing provider — redirect back
    if (!isValidProvider(provider)) {
      router.replace('/profile');
      return;
    }

    // Already linked — silent redirect
    if (user?.[PROVIDER_KEY[provider]]) {
      router.replace('/profile');
      return;
    }

    // Prevent double-initiation on strict-mode remount
    if (isLinkInitiated.current) return;
    isLinkInitiated.current = true;

    linkFnRef.current[provider]();
  }, [ready, authenticated, user, provider, hasOAuthParams, router]);

  // Show spinner during Phase 2 (OAuth return) — Privy is processing
  const isLoading = !error;

  return { isLoading, error };
};
