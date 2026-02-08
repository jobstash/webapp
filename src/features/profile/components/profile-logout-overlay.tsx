'use client';

import { LoaderIcon } from 'lucide-react';

import { useSession } from '@/features/auth/hooks/use-session';

export const ProfileLogoutOverlay = () => {
  const { isLoggingOut } = useSession();

  if (!isLoggingOut) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80'>
      <LoaderIcon className='size-8 animate-spin text-muted-foreground' />
    </div>
  );
};
