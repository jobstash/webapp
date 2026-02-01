import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { MAX_MATCH_SKILLS } from '@/lib/constants';
import { clientEnv } from '@/lib/env/client';
import { nonEmptyStringSchema } from '@/lib/schemas';
import { getSession } from '@/lib/server/session';

const jobMatchResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    score: z.number(),
    category: nonEmptyStringSchema,
  }),
});

const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

interface RouteContext {
  params: Promise<{ uuid: string }>;
}

export const GET = async (
  req: NextRequest,
  context: RouteContext,
): Promise<NextResponse> => {
  try {
    const session = await getSession();
    if (!session.apiToken) {
      return jsonError('Not authenticated', 401);
    }

    const { uuid } = await context.params;
    if (!uuid) {
      return jsonError('Missing job uuid', 400);
    }

    const skills = (req.nextUrl.searchParams.get('skills') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX_MATCH_SKILLS)
      .sort();

    if (skills.length === 0) {
      return jsonError('No skills provided', 400);
    }

    const url = new URL(`${clientEnv.MW_URL}/jobs/match/${uuid}`);
    url.searchParams.set('skills', skills.join(','));
    url.searchParams.set('isExpert', String(session.isExpert ?? false));

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
    const parsed = jobMatchResponseSchema.safeParse(json);

    if (!parsed.success) {
      return jsonError('Invalid response from backend', 502);
    }

    const response = NextResponse.json(parsed.data);

    const cacheControl = res.headers.get('cache-control');
    if (cacheControl) {
      response.headers.set('cache-control', cacheControl);
    }

    return response;
  } catch {
    return jsonError('Internal server error', 500);
  }
};
