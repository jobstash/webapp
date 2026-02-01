import { NextResponse } from 'next/server';

import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';

export const GET = async (): Promise<NextResponse> => {
  try {
    const session = await getSession();
    const apiToken = session.apiToken;

    if (!apiToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let res: Response;
    try {
      res = await fetch(`${clientEnv.MW_URL}/profile/skills`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
    } catch {
      return NextResponse.json(
        { error: 'Failed to connect to backend' },
        { status: 502 },
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend returned ${res.status}` },
        { status: res.status >= 500 ? 502 : res.status },
      );
    }

    let json: unknown;
    try {
      json = await res.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid response from backend' },
        { status: 502 },
      );
    }

    return NextResponse.json(json);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
};
