'use client';

import { CheckCircle2Icon, ClockIcon, LoaderIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

import { useProfileAccounts } from './use-profile-accounts';

const PILL_BASE = cn(
  'inline-flex items-center gap-2 rounded-full px-3 py-1.5',
  'text-sm font-medium ring-1',
);

const PILL_CONNECTED = cn(PILL_BASE, 'bg-accent/60 ring-neutral-700/50');

const PILL_CONNECT = cn(
  PILL_BASE,
  'cursor-pointer bg-accent/60 ring-neutral-700/50',
  'transition-colors hover:bg-accent hover:ring-neutral-600/50',
);

const PILL_DISABLED = cn(
  PILL_BASE,
  'bg-accent/30 opacity-50 ring-neutral-700/30',
);

const SectionLayout = ({ children }: React.PropsWithChildren) => (
  <div className='flex flex-col gap-3'>
    <div>
      <h3 className='text-base font-semibold'>Linked Accounts</h3>
      <p className='text-xs text-muted-foreground'>
        Connect accounts to verify your identity
      </p>
    </div>
    {children}
  </div>
);

interface AccountPillProps {
  account: ReturnType<typeof useProfileAccounts>['accounts'][number];
}

const AccountPill = ({ account }: AccountPillProps) => {
  const Icon = account.icon;

  if (!account.isEnabled) {
    return (
      <span className={PILL_DISABLED}>
        <Icon className='size-3.5 text-muted-foreground/50' />
        <span className='text-muted-foreground'>{account.label}</span>
        <ClockIcon className='size-3 text-muted-foreground/50' />
      </span>
    );
  }

  if (account.isConnected) {
    return (
      <span className={PILL_CONNECTED}>
        <Icon className='size-3.5 text-muted-foreground' />
        {account.subtitle ?? account.connectedLabel}
        <CheckCircle2Icon className='size-3.5 text-emerald-500' />
      </span>
    );
  }

  if (account.isLinking) {
    return (
      <span className={cn(PILL_CONNECT, 'pointer-events-none opacity-70')}>
        <LoaderIcon className='size-3.5 animate-spin text-muted-foreground' />
        {account.label}
      </span>
    );
  }

  return (
    <button type='button' className={PILL_CONNECT} onClick={account.onLink}>
      <Icon className='size-3.5 text-muted-foreground' />
      {account.label}
    </button>
  );
};

export const LinkedAccountsSection = () => {
  const { accounts, isPending } = useProfileAccounts();

  if (isPending) {
    return (
      <SectionLayout>
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-24 rounded-full' />
          ))}
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout>
      <div className='flex flex-wrap items-center gap-2'>
        {accounts.map((account) => (
          <AccountPill key={account.key} account={account} />
        ))}
      </div>
    </SectionLayout>
  );
};
