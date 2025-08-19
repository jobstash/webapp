'use client';

import { notFound } from 'next/navigation';

import { useAuthSelector } from '@/lib/auth/providers';

const ProfilePage = () => {
  const hasPermission = useAuthSelector((snapshot) => {
    return snapshot.matches('authenticated');
  });

  if (!hasPermission) {
    return notFound();
  }

  return <div>ProfilePage</div>;
};
export default ProfilePage;
