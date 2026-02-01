import type { ReactNode } from 'react';

import { redirect } from 'next/navigation';

import { getSession } from '@/lib/server/session';

interface SessionRedirectProps {
  children: ReactNode;
  redirectUrl?: string;
}

export const SessionRedirect = async ({
  children,
  redirectUrl = '/profile',
}: SessionRedirectProps) => {
  const session = await getSession();

  if (session.apiToken) {
    redirect(redirectUrl);
  }

  return children;
};
