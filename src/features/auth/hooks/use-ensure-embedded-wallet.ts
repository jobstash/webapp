'use client';

import { useEffect, useRef, useState } from 'react';

import { useCreateWallet, usePrivy, useUser } from '@privy-io/react-auth';

type WalletStatus = 'idle' | 'checking' | 'creating' | 'ready' | 'error';

export const useEnsureEmbeddedWallet = (): { isWalletReady: boolean } => {
  const { ready, authenticated, user } = usePrivy();
  const { refreshUser } = useUser();
  const { createWallet } = useCreateWallet();
  const [status, setStatus] = useState<WalletStatus>('idle');
  const isCreatingRef = useRef(false);

  useEffect(() => {
    if (!ready || !authenticated || !user) {
      setStatus('idle');
      return;
    }

    const hasEmbeddedWallet = user.linkedAccounts?.some(
      (a) => a.type === 'wallet' && a.walletClientType === 'privy',
    );

    if (hasEmbeddedWallet) {
      setStatus('ready');
      return;
    }

    if (isCreatingRef.current) return;

    const create = async (): Promise<void> => {
      isCreatingRef.current = true;
      setStatus('creating');

      try {
        await createWallet();
        await refreshUser();
        setStatus('ready');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        // Race condition: wallet was already created
        if (message.includes('already has an embedded wallet')) {
          setStatus('ready');
          return;
        }
        setStatus('error');
      } finally {
        isCreatingRef.current = false;
      }
    };

    void create();
  }, [ready, authenticated, user, createWallet, refreshUser]);

  return { isWalletReady: status === 'ready' };
};
