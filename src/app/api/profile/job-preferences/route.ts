import { NextResponse } from 'next/server';

import { jobPreferencesSchema } from '@/features/profile/job-preferences';
import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';

const proxy = async (request?: Request) => {
  const { apiToken } = await getSession();
  if (!apiToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const method = request?.method === 'PATCH' ? 'PATCH' : 'GET';
  const body =
    method === 'PATCH' ? await request!.json().catch(() => null) : null;
  if (method === 'PATCH') {
    const parsedBody = jobPreferencesSchema.safeParse(body);
    if (!parsedBody.success) {
      const issue = parsedBody.error.issues[0];
      const field = issue?.path[0];
      const fieldName =
        typeof field === 'string'
          ? field.replace(/([a-z])([A-Z])/g, '$1 $2').toLocaleLowerCase()
          : 'preference';
      return NextResponse.json(
        {
          error: issue
            ? `Check ${fieldName}: ${issue.message}`
            : 'Check your preferences',
        },
        { status: 400 },
      );
    }
  }
  const response = await fetch(`${clientEnv.MW_URL}/profile/job-preferences`, {
    method,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      ...(method === 'PATCH' ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(method === 'PATCH' ? { body: JSON.stringify(body) } : {}),
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
  const parsed = jobPreferencesSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'The service returned an invalid response' },
      { status: 502 },
    );
  }
  return NextResponse.json(parsed.data);
};

export const GET = () => proxy();
export const PATCH = (request: Request) => proxy(request);
