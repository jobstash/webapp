import { NextResponse } from 'next/server';
import { z } from 'zod';

import { jobForMeSchema } from '@/features/profile/job-preferences';
import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';

export const GET = async () => {
  const { apiToken } = await getSession();
  if (!apiToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const response = await fetch(`${clientEnv.MW_URL}/jobs/for-me`, {
    headers: { Authorization: `Bearer ${apiToken}` },
    cache: 'no-store',
  }).catch(() => null);
  if (!response) {
    return NextResponse.json(
      { error: 'The service is unavailable' },
      { status: 502 },
    );
  }
  const json: unknown = await response.json().catch(() => null);
  if (!response.ok) return NextResponse.json(json, { status: response.status });
  const parsed = z.array(jobForMeSchema).safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'The service returned an invalid response' },
      { status: 502 },
    );
  }
  return NextResponse.json(parsed.data);
};
