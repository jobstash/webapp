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

    const data: {
      type: string;
      email: string | null;
      username: string | null;
    }[] = [];

    if (user.google) {
      data.push({
        type: 'google_oauth',
        email: user.google.email ?? null,
        username: null,
      });
    }

    if (user.github) {
      data.push({
        type: 'github_oauth',
        email: user.github.email ?? null,
        username: user.github.username ?? null,
      });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch linked accounts' },
      { status: 502 },
    );
  }
};
