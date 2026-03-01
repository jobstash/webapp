'use client';

import { usePrivy } from '@privy-io/react-auth';

import { useSession } from '@/features/auth/hooks/use-session';

import { ProfileCard } from './profile-card';

export const DebugPrivyInfo = () => {
  const session = useSession();
  const { user, ready, authenticated } = usePrivy();

  const linkedAccounts = user?.linkedAccounts ?? [];

  const embeddedWallet = linkedAccounts.find(
    (a) => a.type === 'wallet' && a.walletClientType === 'privy',
  );

  const otherAccounts = linkedAccounts.filter(
    (a) => !(a.type === 'wallet' && a.walletClientType === 'privy'),
  );

  return (
    <ProfileCard title='Debug: Session Info'>
      <div className='flex flex-col gap-4 font-mono text-xs'>
        {/* Privy SDK State */}
        <section>
          <h3 className='mb-1 text-sm font-semibold text-muted-foreground'>
            Privy SDK
          </h3>
          <pre className='rounded bg-neutral-900 p-2 break-all whitespace-pre-wrap'>
            {JSON.stringify(
              {
                ready,
                authenticated,
                userId: user?.id ?? null,
                createdAt: user?.createdAt ?? null,
                linkedAccountCount: linkedAccounts.length,
              },
              null,
              2,
            )}
          </pre>
        </section>

        {/* Embedded Wallet */}
        <section>
          <h3 className='mb-1 text-sm font-semibold text-muted-foreground'>
            Embedded Wallet
          </h3>
          <pre className='rounded bg-neutral-900 p-2 break-all whitespace-pre-wrap'>
            {embeddedWallet
              ? JSON.stringify(embeddedWallet, null, 2)
              : 'No embedded wallet found'}
          </pre>
        </section>

        {/* Linked Accounts */}
        <section>
          <h3 className='mb-1 text-sm font-semibold text-muted-foreground'>
            Linked Accounts ({otherAccounts.length})
          </h3>
          <pre className='rounded bg-neutral-900 p-2 break-all whitespace-pre-wrap'>
            {otherAccounts.length
              ? JSON.stringify(otherAccounts, null, 2)
              : 'No linked accounts'}
          </pre>
        </section>

        {/* Session */}
        <section>
          <h3 className='mb-1 text-sm font-semibold text-muted-foreground'>
            Session
          </h3>
          <pre className='rounded bg-neutral-900 p-2 break-all whitespace-pre-wrap'>
            {JSON.stringify(
              {
                apiToken: session.apiToken
                  ? `${session.apiToken.slice(0, 20)}...`
                  : null,
                isExpert: session.isExpert,
                displayName: session.displayName,
                identityType: session.identityType,
                isAuthenticated: session.isAuthenticated,
                isSessionReady: session.isSessionReady,
                isLoading: session.isLoading,
              },
              null,
              2,
            )}
          </pre>
        </section>
      </div>
    </ProfileCard>
  );
};
