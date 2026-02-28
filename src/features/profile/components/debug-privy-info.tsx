'use client';

import { useSession } from '@/features/auth/hooks/use-session';
import { useLinkedAccounts } from '@/features/profile/hooks/use-linked-accounts';

import { ProfileCard } from './profile-card';

export const DebugPrivyInfo = () => {
  const session = useSession();
  const { data: linkedAccounts } = useLinkedAccounts();

  const embeddedWallet = linkedAccounts?.find(
    (a) => a.type === 'embedded_wallet',
  );

  const otherAccounts = linkedAccounts?.filter(
    (a) => a.type !== 'embedded_wallet',
  );

  return (
    <ProfileCard title='Debug: Session Info'>
      <div className='flex flex-col gap-4 font-mono text-xs'>
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
            Linked Accounts ({otherAccounts?.length ?? 0})
          </h3>
          <pre className='rounded bg-neutral-900 p-2 break-all whitespace-pre-wrap'>
            {otherAccounts?.length
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
