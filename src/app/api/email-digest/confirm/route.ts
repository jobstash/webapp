import { NextResponse } from 'next/server';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';

const bodySchema = z.object({ token: z.string().min(32) });

export const POST = async (request: Request) => {
  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  const response = await fetch(
    `${clientEnv.MW_URL}/profile/email-digest/confirm`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body.data),
      cache: 'no-store',
    },
  ).catch(() => null);
  if (!response) return NextResponse.json({ success: false }, { status: 502 });
  const confirmed =
    response.ok && (await response.json().catch(() => false)) === true;
  return NextResponse.json(
    { success: confirmed },
    { status: confirmed ? 200 : 400 },
  );
};
