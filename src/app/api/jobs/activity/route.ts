import { NextResponse } from 'next/server';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';

const requestSchema = z.object({
  shortUUID: z.string().min(1).max(128),
  eventType: z.enum(['job_impression', 'job_view', 'job_dismiss']),
  eventId: z.string().min(1).max(128),
  surface: z.string().max(64).optional(),
  position: z.number().int().min(0).max(1000).optional(),
  dwellMs: z.number().int().min(0).max(86_400_000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const POST = async (req: Request): Promise<NextResponse> => {
  const session = await getSession();
  if (!session.apiToken) return new NextResponse(null, { status: 204 });

  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const response = await fetch(`${clientEnv.MW_URL}/profile/jobs/activity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.apiToken}`,
    },
    body: JSON.stringify(parsed.data),
  }).catch(() => null);
  if (!response) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
  if (!response.ok) {
    return NextResponse.json(
      { error: 'Activity was not recorded' },
      { status: response.status >= 500 ? 502 : response.status },
    );
  }
  return new NextResponse(null, { status: 204 });
};
