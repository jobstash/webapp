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

  // Capture once at mount: did this page load arrive with OAuth callback params?
  // Stored in a ref so the value is frozen for the component's lifetime — even
  // after Privy strips the params via history.replaceState (which does NOT
  // trigger a React re-render and would make a computed value go stale).
  const returnedFromOAuth = useRef<boolean | null>(null);
  if (returnedFromOAuth.current === null) {
    returnedFromOAuth.current =
      typeof window !== 'undefined' &&
      /[?&]privy_oauth_/.test(window.location.search);
  }

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

    // Already linked — redirect regardless of OAuth state.
    // This runs BEFORE the returnedFromOAuth guard so that when Privy
    // updates user.github (even while OAuth params are still in the URL),
    // we immediately redirect to /profile.
    if (user?.[PROVIDER_KEY[provider]]) {
      router.replace('/profile');
      return;
    }

    // Returned from OAuth — Privy is processing the callback.
    // Wait for user object to update (handled by the check above on re-render).
    if (returnedFromOAuth.current) return;

    // Prevent double-initiation on strict-mode remount
    if (isLinkInitiated.current) return;
    isLinkInitiated.current = true;

    linkFnRef.current[provider]();
  }, [ready, authenticated, user, provider, router]);

  const isLoading = !error;

  return { isLoading, error };
};
