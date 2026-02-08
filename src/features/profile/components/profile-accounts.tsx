'use client';

import { CheckCircle2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { ProfileCard } from './profile-card';
import { useProfileAccounts } from './use-profile-accounts';

export const ProfileAccounts = () => {
  const { accounts, isLoading, linkGoogle } = useProfileAccounts();

  if (isLoading) {
    return (
      <ProfileCard title='Linked Accounts'>
        <div className='flex items-center gap-3'>
          <Skeleton className='size-10 shrink-0 rounded-full' />
          <div className='flex min-w-0 grow flex-col gap-0.5'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-3 w-28' />
          </div>
          <Skeleton className='h-8 w-20 rounded-md' />
        </div>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard title='Linked Accounts'>
      <div className='flex flex-col gap-4'>
        {accounts.map((account) => {
          const Icon = account.icon;

          return (
            <div key={account.type} className='flex items-center gap-3'>
              <div className='flex size-10 items-center justify-center rounded-full bg-accent'>
                <Icon className='size-5 text-muted-foreground' />
              </div>

              <div className='flex min-w-0 grow flex-col gap-0.5'>
                <span className='text-sm font-medium'>{account.label}</span>
                <span className='truncate text-xs text-muted-foreground'>
                  {account.isConnected
                    ? (account.connectedEmail ?? 'Connected')
                    : 'Not connected'}
                </span>
              </div>

              {account.isConnected ? (
                <CheckCircle2Icon className='size-5 shrink-0 text-emerald-500' />
              ) : (
                <Button variant='outline' size='sm' onClick={linkGoogle}>
                  Connect
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </ProfileCard>
  );
};
