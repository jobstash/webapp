import { NextResponse } from 'next/server';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';

const bodySchema = z.object({ token: z.string().min(32) });

const unsubscribe = async (token: string) => {
  const response = await fetch(
    `${clientEnv.MW_URL}/profile/email-digest/unsubscribe`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      cache: 'no-store',
    },
  ).catch(() => null);
  if (!response) return false;
  return response.ok && (await response.json().catch(() => false)) === true;
};

export const POST = async (request: Request) => {
  const url = new URL(request.url);
  const queryToken = url.searchParams.get('token');
  const body = queryToken
    ? { success: true as const, data: { token: queryToken } }
    : bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success || !bodySchema.safeParse(body.data).success) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  const success = await unsubscribe(body.data.token);
  return NextResponse.json({ success }, { status: success ? 200 : 400 });
};
