'use client';

import { usePrivy } from '@privy-io/react-auth';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/features/auth/hooks/use-session';

import { DeleteAccountDialog } from './delete-account-dialog';

export const ProfileContent = () => {
  const { user } = usePrivy();
  const {
    apiToken,
    isAuthenticated,
    isSessionReady,
    isLoading,
    isLoggingOut,
    logout,
  } = useSession();

  if (isLoading || !isAuthenticated) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  return (
    <div className='mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12'>
      <h1 className='text-2xl font-bold'>Your Profile</h1>

      <section className='flex flex-col gap-2'>
        <h2 className='text-lg font-semibold'>Session Details</h2>
        <pre className='overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100'>
          {JSON.stringify(user, null, 2)}
        </pre>
      </section>

      <section className='flex flex-col gap-2'>
        <h2 className='text-lg font-semibold'>API Token</h2>
        <pre className='overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm break-all whitespace-pre-wrap text-zinc-100'>
          {isSessionReady ? apiToken : 'Exchanging token...'}
        </pre>
      </section>

      <Button
        variant='destructive'
        disabled={isLoggingOut}
        onClick={logout}
        className='w-fit'
      >
        Log out
      </Button>

      <Separator />

      <section className='flex flex-col gap-2'>
        <h2 className='text-lg font-semibold'>Danger Zone</h2>
        <p className='text-sm text-muted-foreground'>
          Permanently delete your account and all associated data.
        </p>
        <DeleteAccountDialog logout={logout} />
      </section>
    </div>
  );
};
