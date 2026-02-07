'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';

import { DeleteAccountDialog } from './delete-account-dialog';

export const ProfileContent = () => {
  const {
    apiToken,
    isExpert,
    isSessionReady,
    isLoading,
    isLoggingOut,
    logout,
  } = useSession();

  const skills = useProfileSkills(isSessionReady);
  const showcase = useProfileShowcase(isSessionReady);

  if (isLoading) {
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
        <pre className='overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm break-all whitespace-pre-wrap text-zinc-100'>
          {JSON.stringify({ apiToken, isExpert, isSessionReady }, null, 2)}
        </pre>
      </section>

      <section className='flex flex-col gap-2'>
        <h2 className='text-lg font-semibold'>Skills</h2>
        <pre className='overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100'>
          {skills.isPending
            ? 'Loading...'
            : skills.error
              ? `Error: ${skills.error.message}`
              : JSON.stringify(skills.data, null, 2)}
        </pre>
      </section>

      <section className='flex flex-col gap-2'>
        <h2 className='text-lg font-semibold'>Showcases</h2>
        <pre className='overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100'>
          {showcase.isPending
            ? 'Loading...'
            : showcase.error
              ? `Error: ${showcase.error.message}`
              : JSON.stringify(showcase.data, null, 2)}
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
