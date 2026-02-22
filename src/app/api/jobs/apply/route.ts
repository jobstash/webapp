import { NextResponse } from 'next/server';

import { clientEnv } from '@/lib/env/client';
import {
  applyRequestSchema,
  applyResponseSchema,
} from '@/features/jobs/apply-schemas';
import { getSession } from '@/lib/server/session';

const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const session = await getSession();
    if (!session.apiToken) {
      return jsonError('Not authenticated', 401);
    }

    const body: unknown = await req.json().catch(() => null);
    const parsed = applyRequestSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError('Invalid request body', 400);
    }

    const url = `${clientEnv.MW_URL}/v2/profile/jobs/apply`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.apiToken}`,
      },
      body: JSON.stringify(parsed.data),
    }).catch(() => null);

    if (!res) {
      return jsonError('Failed to connect to backend', 502);
    }

    if (!res.ok) {
      return jsonError(
        `Backend returned ${res.status}`,
        res.status >= 500 ? 502 : res.status,
      );
    }

    const json: unknown = await res.json().catch(() => null);
    const result = applyResponseSchema.safeParse(json);

    if (!result.success) {
      return jsonError('Invalid response from backend', 502);
    }

    return NextResponse.json(result.data);
  } catch {
    return jsonError('Internal server error', 500);
  }
};
