import { NextResponse } from 'next/server';

import {
  publicProfileAppealInputSchema,
  publicProfileMutationResponseSchema,
} from '@/features/public-profiles/schemas';
import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';

type RouteContext = { params: Promise<{ noticeId: string }> };

export const POST = async (request: Request, context: RouteContext) => {
  const { noticeId } = await context.params;
  const { apiToken } = await getSession();
  if (!apiToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const body: unknown = await request.json().catch(() => null);
  const parsed = publicProfileAppealInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid appeal' }, { status: 400 });
  }
  const response = await fetch(
    `${clientEnv.MW_URL}/profiles/notices/${encodeURIComponent(noticeId)}/appeals`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
    },
  ).catch(() => null);
  if (!response) {
    return NextResponse.json(
      { error: 'The service is unavailable' },
      { status: 502 },
    );
  }
  const json: unknown = await response.json().catch(() => null);
  if (!response.ok) return NextResponse.json(json, { status: response.status });
  const result = publicProfileMutationResponseSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: 'The service returned an invalid response' },
      { status: 502 },
    );
  }
  return NextResponse.json(result.data);
};
