'use client';

import { LogOutIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/hooks/use-session';

import { DeleteAccountDialog } from './delete-account-dialog';
import { ProfileCard } from './profile-card';

export const ProfileSettings = () => {
  const { isLoggingOut, logout } = useSession();

  return (
    <div className='flex flex-col gap-4'>
      <ProfileCard title='Session'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-sm font-medium'>Log out of your account</span>
            <span className='text-xs text-muted-foreground'>
              You will be redirected to the home page
            </span>
          </div>
          <Button
            variant='outline'
            size='sm'
            disabled={isLoggingOut}
            onClick={logout}
          >
            <LogOutIcon className='size-3.5' />
            {isLoggingOut ? 'Logging out...' : 'Log out'}
          </Button>
        </div>
      </ProfileCard>

      <ProfileCard
        title='Danger Zone'
        className='border-destructive/30 [&>h2]:text-destructive'
      >
        <div className='flex items-center justify-between gap-4'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-sm font-medium'>Delete your account</span>
            <span className='text-xs text-muted-foreground'>
              Permanently delete your account and all associated data
            </span>
          </div>
          <DeleteAccountDialog logout={logout} />
        </div>
      </ProfileCard>
    </div>
  );
};
