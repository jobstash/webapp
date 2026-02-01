import { NextResponse } from 'next/server';

import { clientEnv } from '@/lib/env/client';
import { messageResponseSchema } from '@/lib/schemas';
import { getSession } from '@/lib/server/session';

const ROUTE_TAG = '[POST /api/profile/delete]';

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(): Promise<NextResponse> {
  const session = await getSession();
  const isExpired =
    session.expiresAt !== undefined && session.expiresAt <= Date.now();

  if (!session.apiToken || isExpired) {
    session.destroy();
    return errorResponse('Not authenticated', 401);
  }

  let res: Response;
  try {
    res = await fetch(`${clientEnv.MW_URL}/profile/delete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.apiToken}` },
    });
  } catch (error) {
    console.error(`${ROUTE_TAG} Backend connection failed:`, error);
    return errorResponse('Failed to connect to backend', 502);
  }

  if (!res.ok) {
    console.error(`${ROUTE_TAG} Backend returned ${res.status}`);
    return errorResponse(
      'Delete request failed',
      res.status >= 500 ? 502 : res.status,
    );
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return errorResponse('Invalid response from backend', 502);
  }

  const parsed = messageResponseSchema.safeParse(json);
  if (!parsed.success) {
    console.error(
      `${ROUTE_TAG} Invalid backend response:`,
      parsed.error.flatten(),
    );
    return errorResponse('Invalid response format from backend', 502);
  }

  if (parsed.data.success) {
    session.destroy();
  }

  return NextResponse.json(parsed.data);
}
