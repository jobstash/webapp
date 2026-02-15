import { NextResponse } from 'next/server';

import { getPrivyUser } from '@/lib/server/privy';
import { getSession } from '@/lib/server/session';

export const GET = async (): Promise<NextResponse> => {
  console.log(
    `[DEBUG:LinkedAccountsAPI][${new Date().toISOString()}] checking session`,
  );
  const session = await getSession();
  const privyDid = session.privyDid;

  console.log(
    `[DEBUG:LinkedAccountsAPI][${new Date().toISOString()}] privyDid=${privyDid ? String(privyDid) : 'null'}`,
  );

  if (!privyDid) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = await getPrivyUser(privyDid);
    console.log(
      `[DEBUG:LinkedAccountsAPI][${new Date().toISOString()}] user fetched, hasGoogle=${String(!!user.google)}`,
    );

    const data = user.google
      ? [{ type: 'google_oauth' as const, email: user.google.email ?? null }]
      : [];

    return NextResponse.json({ data });
  } catch (error) {
    console.log(
      `[DEBUG:LinkedAccountsAPI][${new Date().toISOString()}] getPrivyUser failed: ${String(error)}`,
    );
    return NextResponse.json(
      { error: 'Failed to fetch linked accounts' },
      { status: 502 },
    );
  }
};
