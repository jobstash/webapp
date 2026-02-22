import { NextResponse } from 'next/server';

import { clientEnv } from '@/lib/env/client';
import { applyStatusResponseSchema } from '@/features/jobs/apply-schemas';
import { getSession } from '@/lib/server/session';

const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

interface RouteContext {
  params: Promise<{ shortUUID: string }>;
}

export const GET = async (
  _req: Request,
  context: RouteContext,
): Promise<NextResponse> => {
  try {
    const session = await getSession();
    if (!session.apiToken) {
      return jsonError('Not authenticated', 401);
    }

    const { shortUUID } = await context.params;
    if (!shortUUID) {
      return jsonError('Missing job shortUUID', 400);
    }

    const url = `${clientEnv.MW_URL}/v2/profile/jobs/apply/status/${shortUUID}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${session.apiToken}` },
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
    const parsed = applyStatusResponseSchema.safeParse(json);

    if (!parsed.success) {
      return jsonError('Invalid response from backend', 502);
    }

    return NextResponse.json(parsed.data);
  } catch {
    return jsonError('Internal server error', 500);
  }
};
