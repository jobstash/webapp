import type { ReactNode } from 'react';

import { redirect } from 'next/navigation';

import { getSession } from '@/lib/server/session';

interface AuthGuardProps {
  children: ReactNode;
  fallbackUrl?: string;
}

export const AuthGuard = async ({
  children,
  fallbackUrl = '/login',
}: AuthGuardProps) => {
  const session = await getSession();

  if (!session.apiToken) {
    redirect(fallbackUrl);
  }

  return <>{children}</>;
};
