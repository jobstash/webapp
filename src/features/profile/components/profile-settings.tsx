'use client';

import { DeleteAccountDialog } from './delete-account-dialog';
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

export const ProfileSettings = () => (
  <div className='flex flex-col gap-4'>
    <ProfileCard
      title='Danger Zone'
      className='border-destructive/30 [&>h2]:text-destructive'
    >
      <SettingsRow
        title='Delete your account'
        description='Permanently delete your account and all associated data'
        action={<DeleteAccountDialog />}
      />
    </ProfileCard>
  </div>
);
