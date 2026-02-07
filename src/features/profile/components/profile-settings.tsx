'use client';

import { LogOutIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/hooks/use-session';

import { DeleteAccountDialog } from './delete-account-dialog';
import { ProfileAccounts } from './profile-accounts';
import { ProfileCard } from './profile-card';

const SettingsRow = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
}) => (
  <div className='flex items-center justify-between gap-4'>
    <div className='flex flex-col gap-0.5'>
      <span className='text-sm font-medium'>{title}</span>
      <span className='text-xs text-muted-foreground'>{description}</span>
    </div>
    {action}
  </div>
);

export const ProfileSettings = () => {
  const { isLoggingOut, logout } = useSession();

  return (
    <div className='flex flex-col gap-4'>
      <ProfileAccounts />

      <ProfileCard title='Session'>
        <SettingsRow
          title='Log out of your account'
          description='You will be redirected to the home page'
          action={
            <Button
              variant='outline'
              size='sm'
              disabled={isLoggingOut}
              onClick={logout}
            >
              <LogOutIcon className='size-3.5' />
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </Button>
          }
        />
      </ProfileCard>

      <ProfileCard
        title='Danger Zone'
        className='border-destructive/30 [&>h2]:text-destructive'
      >
        <SettingsRow
          title='Delete your account'
          description='Permanently delete your account and all associated data'
          action={<DeleteAccountDialog logout={logout} />}
        />
      </ProfileCard>
    </div>
  );
};
