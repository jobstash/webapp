import { useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { normalize } from 'viem/ens';
import { useEnsAvatar, usePublicClient } from 'wagmi';

import { useLinkedWallets } from './use-linked-wallets';

import { useAuthSelector } from '@/lib/auth/providers';

export function useEnsInfo(opts?: { chainId?: number }) {
  const { isLoggedIn, isLoadingAuth } = useAuthSelector((snapshot) => {
    return {
      isLoggedIn: snapshot.context.isLoggedIn,
      isLoadingAuth:
        snapshot.matches('gettingUser') ||
        snapshot.matches('gettingPrivyToken') ||
        snapshot.matches('syncingSession') ||
        snapshot.matches('loggingOutPrivy') ||
        snapshot.matches('loggingOutSession'),
    };
  });

  const chainId = opts?.chainId ?? 1;
  const addresses = useLinkedWallets();
  const client = usePublicClient({ chainId });
  const shouldQuery = isLoggedIn && !isLoadingAuth && !!client && addresses.length > 0;

  const {
    data: match,
    isLoading: isLoadingNames,
    error,
  } = useQuery<{ address: Address; name: string } | null>({
    queryKey: ['ens:first-hit', addresses, chainId],
    enabled: shouldQuery,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!client) return null;
      const results = await Promise.all(
        addresses.map(async (address) => {
          try {
            const name = await client.getEnsName({ address: address as Address });
            return { address: address as Address, name: name ?? null };
          } catch {
            return { address: address as Address, name: null };
          }
        }),
      );
      const hit = results.find((r) => r.name);
      return hit ? { address: hit.address, name: hit.name as string } : null;
    },
  });

  const { data: avatar, isLoading: isLoadingAvatar } = useEnsAvatar({
    chainId,
    name: match?.name ? normalize(match.name) : undefined,
    query: { enabled: Boolean(match?.name) },
  });

  return {
    isLoading: isLoadingAuth || isLoadingNames || isLoadingAvatar,
    ensName: match?.name,
    ensAvatar: typeof avatar === 'string' ? avatar : undefined,
    matchedAddress: match?.address,
    error,
  };
}
