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
  console.log(
    `[DEBUG:AuthGuard][${new Date().toISOString()}] checking session...`,
  );
  const session = await getSession();
  console.log(
    `[DEBUG:AuthGuard][${new Date().toISOString()}] session result: hasToken=${String(!!session.apiToken)}, expiresAt=${String(session.expiresAt ?? null)}`,
  );

  if (!session.apiToken) {
    console.log(
      `[DEBUG:AuthGuard][${new Date().toISOString()}] no token, redirecting to ${fallbackUrl}`,
    );
    redirect(fallbackUrl);
  }

  console.log(
    `[DEBUG:AuthGuard][${new Date().toISOString()}] session valid, rendering children`,
  );
  return <>{children}</>;
};
