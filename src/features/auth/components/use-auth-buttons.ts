import { useState } from 'react';

import {
  useConnectWallet,
  useCreateWallet,
  useLoginWithEmail,
  useLoginWithOAuth,
  usePrivy,
  useWallets,
} from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@bprogress/next/app';
import { useProgress } from '@bprogress/next';

import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { SESSION_KEY } from '@/features/auth/constants';
import { createSession } from '@/features/auth/lib/create-session';

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

export const useAuthButtons = ({ redirectTo }: { redirectTo: string }) => {
  const { start } = useProgress();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { getAccessToken } = usePrivy();
  const { createWallet } = useCreateWallet();

  const [isLoading, setIsLoading] = useState(false);
  const [preferredMethod] = useState(getLastAuthMethod);
  const [emailStep, setEmailStep] = useState<EmailStep>('idle');
  const [emailAddress, setEmailAddress] = useState('');

  const postLogin = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Wallet must exist before session creation (API returns 422 without it).
      // Retry with backoff — SDK state may still be settling after OAuth.
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await createWallet();
          break;
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          if (msg.includes('already has an embedded wallet')) break;
          if (attempt < 2)
            await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        }
      }

      // Create server session
      const privyToken = await getAccessToken();
      if (!privyToken) throw new Error('No Privy access token');

      const session = await createSession(privyToken);
      queryClient.setQueryData(SESSION_KEY, session);

      // Redirect
      router.replace(redirectTo);
    } catch {
      setIsLoading(false);
    }
  };

  const { initOAuth, loading: isOAuthLoading } = useLoginWithOAuth({
    onComplete: ({ loginMethod }) => {
      trackEvent(GA_EVENT.LOGIN_COMPLETED, {
        login_method: loginMethod ?? 'google',
      });
      void postLogin();
    },
  });

  const { sendCode, loginWithCode } = useLoginWithEmail({
    onComplete: ({ loginMethod }) => {
      trackEvent(GA_EVENT.LOGIN_COMPLETED, {
        login_method: loginMethod ?? 'email',
      });
      void postLogin();
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
      const address = result?.wallet?.address;
      const connectedWallet = wallets.find((w) => w.address === address);

      if (connectedWallet) {
        try {
          await connectedWallet.loginOrLink();
          trackEvent(GA_EVENT.LOGIN_COMPLETED, { login_method: 'wallet' });
          await postLogin();
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
      // onComplete callback handles postLogin
    } catch {
      // Privy state holds error
    }
    setIsLoading(false);
  };

  const handleEmailBack = () => setEmailStep('idle');

  return {
    isLoading: isLoading || isOAuthLoading,
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

export type AuthButtonsState = ReturnType<typeof useAuthButtons>;
