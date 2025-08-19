'use client';

import { notFound } from 'next/navigation';

import { useAuthSelector } from '@/lib/auth/providers';
import { ProfileEntrypointPage } from '@/lib/profile/pages/profile-entrypoint.page';
import { ProfileEntrypointMachineProvider } from '@/lib/profile/providers';

export const ProfilePage = () => {
  const hasPermission = useAuthSelector((snapshot) => {
    return snapshot.matches('authenticated');
  });

  if (!hasPermission) {
    return notFound();
  }

  return (
    <ProfileEntrypointMachineProvider>
      <ProfileEntrypointPage />
    </ProfileEntrypointMachineProvider>
  );
};
