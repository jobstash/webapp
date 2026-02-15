import { NextResponse } from 'next/server';

import { getPrivyUser } from '@/lib/server/privy';
import { getSession } from '@/lib/server/session';

export const GET = async (): Promise<NextResponse> => {
  const session = await getSession();
  const privyDid = session.privyDid;

  if (!privyDid) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = await getPrivyUser(privyDid);

    const data = user.google
      ? [{ type: 'google_oauth' as const, email: user.google.email ?? null }]
      : [];

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch linked accounts' },
      { status: 502 },
    );
  }
};
