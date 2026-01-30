import { useState } from 'react';

import { useLoginWithOAuth } from '@privy-io/react-auth';

export const useAuthButtons = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { initOAuth } = useLoginWithOAuth();

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      await initOAuth({ provider: 'google' });
    } catch {
      setIsGoogleLoading(false);
    }
  };

  const handleWallet = () => {};
  const handleGithub = () => {};
  const handleEmail = () => {};

  return {
    isGoogleLoading,
    handleWallet,
    handleGithub,
    handleGoogle,
    handleEmail,
  };
};
