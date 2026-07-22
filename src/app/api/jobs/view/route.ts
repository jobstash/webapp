import { NextResponse } from 'next/server';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';

const requestSchema = z.object({
  shortUUID: z.string().min(1).max(128),
});

export const POST = async (req: Request): Promise<NextResponse> => {
  const session = await getSession();
  if (!session.apiToken) {
    // Anonymous browsing remains anonymous.  The client intentionally treats
    // this as a no-op rather than encouraging fingerprinting.
    return new NextResponse(null, { status: 204 });
  }

  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  const response = await fetch(`${clientEnv.MW_URL}/v2/profile/jobs/view`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.apiToken}`,
    },
    body: JSON.stringify(parsed.data),
  }).catch(() => null);

  if (!response) {
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 502 },
    );
  }
  if (!response.ok) {
    return NextResponse.json(
      { error: `Backend returned ${response.status}` },
      { status: response.status >= 500 ? 502 : response.status },
    );
  }
  return new NextResponse(null, { status: 204 });
};
