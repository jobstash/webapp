'use client';

import { Button } from '@/components/ui/button';

import { useProfileContent } from './use-profile-content';

export const ProfileContent = () => {
  const {
    isLoading,
    isAuthenticated,
    user,
    apiToken,
    isTokenPending,
    isTokenError,
    tokenError,
    handleLogout,
  } = useProfileContent();

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
          {isTokenPending && 'Exchanging token...'}
          {isTokenError &&
            `Error: ${tokenError?.message ?? 'Failed to fetch API token'}`}
          {!isTokenPending && !isTokenError && apiToken}
        </pre>
      </section>

      <Button variant='destructive' onClick={handleLogout} className='w-fit'>
        Log out
      </Button>
    </div>
  );
};
