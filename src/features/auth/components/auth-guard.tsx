import type { ReactNode } from 'react';

import { headers } from 'next/headers';
import { loginHref } from '../lib/return-navigation';

import { redirect } from 'next/navigation';

import { getSession } from '@/lib/server/session';

interface AuthGuardProps {
  children: ReactNode;
  fallbackUrl?: string;
}

export const AuthGuard = async ({ children, fallbackUrl }: AuthGuardProps) => {
  const session = await getSession();

  if (!session.apiToken) {
    const requestedPath =
      (await headers()).get('x-jobstash-request-path') ?? '/';
    redirect(fallbackUrl ?? loginHref(requestedPath));
  }

  return <>{children}</>;
};
