import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  availabilitySchema,
  updateAvailabilitySchema,
} from '@/features/profile/availability';
import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';

const profileResponseSchema = z.object({
  success: z.literal(true),
  data: availabilitySchema,
});

const proxy = async (request?: Request) => {
  const { apiToken } = await getSession();
  if (!apiToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const update = request
    ? updateAvailabilitySchema.safeParse(await request.json().catch(() => null))
    : null;
  if (update && !update.success) {
    return NextResponse.json(
      { error: 'Choose whether to join the talent pool.' },
      { status: 400 },
    );
  }

  const response = await fetch(
    `${clientEnv.MW_URL}/profile/${update ? 'availability' : 'info'}`,
    {
      method: update ? 'POST' : 'GET',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        ...(update ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(update?.success ? { body: JSON.stringify(update.data) } : {}),
      cache: 'no-store',
    },
  ).catch(() => null);

  if (!response?.ok) {
    return NextResponse.json(
      { error: 'Could not update talent pool settings. Please try again.' },
      { status: response && response.status < 500 ? response.status : 502 },
    );
  }
  const result: unknown = await response.json().catch(() => null);
  if (update?.success) {
    if (!z.object({ success: z.literal(true) }).safeParse(result).success) {
      return NextResponse.json(
        { error: 'Your talent pool setting was not saved. Please try again.' },
        { status: 502 },
      );
    }
    return NextResponse.json({ availableForWork: update.data.availability });
  }

  const profile = profileResponseSchema.safeParse(result);
  if (!profile.success) {
    return NextResponse.json(
      { error: 'Could not load talent pool settings. Please try again.' },
      { status: 502 },
    );
  }
  return NextResponse.json(profile.data.data);
};

export const GET = () => proxy();
export const POST = (request: Request) => proxy(request);
