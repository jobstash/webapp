import { useState } from 'react';

import { useLoginWithOAuth } from '@privy-io/react-auth';
import { useProgress } from '@bprogress/next';

import { GA_EVENT, trackEvent } from '@/lib/analytics';

export type AuthMethod = 'google' | 'github' | 'wallet' | 'email';

const STORAGE_KEY = 'jobstash:last-auth-method';
const DEFAULT_METHOD: AuthMethod = 'google';

const getLastAuthMethod = (): AuthMethod => {
  if (typeof window === 'undefined') return DEFAULT_METHOD;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (
    stored === 'google' ||
    stored === 'github' ||
    stored === 'wallet' ||
    stored === 'email'
  ) {
    return stored;
  }

  return DEFAULT_METHOD;
};

const saveAuthMethod = (method: AuthMethod): void => {
  localStorage.setItem(STORAGE_KEY, method);
};

export const useAuthButtons = () => {
  const { start } = useProgress();
  const [isLoading, setIsLoading] = useState(false);
  const [preferredMethod] = useState(getLastAuthMethod);

  const { initOAuth } = useLoginWithOAuth({
    onComplete: ({ loginMethod }) => {
      trackEvent(GA_EVENT.LOGIN_COMPLETED, {
        login_method: loginMethod ?? 'google',
      });
    },
  });

  const handleGoogle = async () => {
    trackEvent(GA_EVENT.LOGIN_STARTED, { login_method: 'google' });
    saveAuthMethod('google');
    setIsLoading(true);
    start();
    try {
      await initOAuth({ provider: 'google' });
    } catch {
      setIsLoading(false);
    }
  };

  const handleGithub = async () => {
    trackEvent(GA_EVENT.LOGIN_STARTED, { login_method: 'github' });
    saveAuthMethod('github');
    setIsLoading(true);
    start();
    try {
      await initOAuth({ provider: 'github' });
    } catch {
      setIsLoading(false);
    }
  };

  const handleWallet = () => {
    trackEvent(GA_EVENT.LOGIN_STARTED, { login_method: 'wallet' });
    saveAuthMethod('wallet');
  };

  const handleEmail = () => {
    trackEvent(GA_EVENT.LOGIN_STARTED, { login_method: 'email' });
    saveAuthMethod('email');
  };

  return {
    isLoading,
    preferredMethod,
    handleWallet,
    handleGithub,
    handleGoogle,
    handleEmail,
  };
};
