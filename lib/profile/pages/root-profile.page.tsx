'use client';

import { notFound } from 'next/navigation';

import { useAuthSelector } from '@/lib/auth/providers';
import { ProfileEntrypointPage } from '@/lib/profile/pages/profile-entrypoint.page';
import { ProfileEntrypointMachineProvider } from '@/lib/profile/providers';

export const RootProfilePage = () => {
  const { isLoggedIn } = useAuthSelector((snapshot) => {
    return {
      isLoggedIn: snapshot.context.isLoggedIn,
    };
  });

  if (!isLoggedIn) {
    return notFound();
  }

  return (
    <ProfileEntrypointMachineProvider>
      <ProfileEntrypointPage />
    </ProfileEntrypointMachineProvider>
  );
};
