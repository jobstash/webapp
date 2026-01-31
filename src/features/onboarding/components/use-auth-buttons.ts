import { useState } from 'react';

import { useLoginWithOAuth } from '@privy-io/react-auth';

import { GA_EVENT, trackEvent } from '@/lib/analytics';

export const useAuthButtons = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { initOAuth } = useLoginWithOAuth({
    onComplete: ({ loginMethod }) => {
      trackEvent(GA_EVENT.LOGIN_COMPLETED, {
        login_method: loginMethod ?? 'google',
      });
    },
  });

  const handleGoogle = async () => {
    trackEvent(GA_EVENT.LOGIN_STARTED, { login_method: 'google' });
    setIsGoogleLoading(true);
    try {
      await initOAuth({ provider: 'google' });
    } catch {
      setIsGoogleLoading(false);
    }
  };

  const handleWallet = () => {
    trackEvent(GA_EVENT.LOGIN_STARTED, { login_method: 'wallet' });
  };

  const handleGithub = () => {
    trackEvent(GA_EVENT.LOGIN_STARTED, { login_method: 'github' });
  };

  const handleEmail = () => {
    trackEvent(GA_EVENT.LOGIN_STARTED, { login_method: 'email' });
  };

  return {
    isGoogleLoading,
    handleWallet,
    handleGithub,
    handleGoogle,
    handleEmail,
  };
};
