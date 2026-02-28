import { useState } from 'react';

import {
  useConnectWallet,
  useLoginWithEmail,
  useLoginWithOAuth,
  useWallets,
} from '@privy-io/react-auth';
import { useProgress } from '@bprogress/next';

import { GA_EVENT, trackEvent } from '@/lib/analytics';

export type AuthMethod = 'google' | 'github' | 'wallet' | 'email';
export type EmailStep = 'idle' | 'entering-email' | 'code-sent';

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
  const [emailStep, setEmailStep] = useState<EmailStep>('idle');
  const [emailAddress, setEmailAddress] = useState('');

  const { initOAuth } = useLoginWithOAuth({
    onComplete: ({ loginMethod }) => {
      trackEvent(GA_EVENT.LOGIN_COMPLETED, {
        login_method: loginMethod ?? 'google',
      });
    },
  });

  const { sendCode, loginWithCode } = useLoginWithEmail({
    onComplete: ({ loginMethod }) => {
      trackEvent(GA_EVENT.LOGIN_COMPLETED, {
        login_method: loginMethod ?? 'email',
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

  const { wallets } = useWallets();

  const { connectWallet } = useConnectWallet({
    onSuccess: async (result) => {
      // connectWallet only connects — it doesn't authenticate.
      // We need to call loginOrLink() to trigger SIWE and set authenticated=true.
      const address = result?.wallet?.address;
      const connectedWallet = wallets.find((w) => w.address === address);

      if (connectedWallet) {
        try {
          await connectedWallet.loginOrLink();
          trackEvent(GA_EVENT.LOGIN_COMPLETED, { login_method: 'wallet' });
        } catch {
          // loginOrLink failed — user rejected SIWE or wallet error
        }
      }
    },
  });

  const handleWallet = () => {
    trackEvent(GA_EVENT.LOGIN_STARTED, { login_method: 'wallet' });
    saveAuthMethod('wallet');
    connectWallet();
  };

  const handleEmail = () => {
    trackEvent(GA_EVENT.LOGIN_STARTED, { login_method: 'email' });
    saveAuthMethod('email');
    setEmailStep('entering-email');
  };

  const handleEmailSubmit = async (email: string) => {
    setEmailAddress(email);
    setIsLoading(true);
    try {
      await sendCode({ email });
      setEmailStep('code-sent');
    } catch {
      // Privy state holds error
    }
    setIsLoading(false);
  };

  const handleCodeSubmit = async (code: string) => {
    setIsLoading(true);
    try {
      await loginWithCode({ code });
      // on success: Privy sets authenticated=true → use-login-content redirects
    } catch {
      // Privy state holds error
    }
    setIsLoading(false);
  };

  const handleEmailBack = () => setEmailStep('idle');

  return {
    isLoading,
    preferredMethod,
    emailStep,
    emailAddress,
    handleGithub,
    handleGoogle,
    handleWallet,
    handleEmail,
    handleEmailSubmit,
    handleCodeSubmit,
    handleEmailBack,
  };
};
