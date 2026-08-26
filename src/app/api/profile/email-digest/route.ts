import { NextResponse } from 'next/server';

import { emailDigestStateSchema } from '@/features/profile/email-digest';
import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';

const proxy = async (method: 'GET' | 'POST' | 'DELETE') => {
  const { apiToken } = await getSession();
  if (!apiToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const path =
    method === 'POST'
      ? '/profile/email-digest/request'
      : '/profile/email-digest';
  const response = await fetch(`${clientEnv.MW_URL}${path}`, {
    method,
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
  if (method === 'DELETE') return NextResponse.json({ success: json === true });
  const parsed = emailDigestStateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'The service returned an invalid response' },
      { status: 502 },
    );
  }
  return NextResponse.json(parsed.data);
};

export const GET = () => proxy('GET');
export const POST = () => proxy('POST');
export const DELETE = () => proxy('DELETE');
