import { type NextRequest, NextResponse } from 'next/server';

import { MAX_MATCH_SKILLS } from '@/lib/constants';
import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';
import { similarJobDto } from '@/features/jobs/server/dtos/similar-job.dto';
import { dtoToSimilarJob } from '@/features/jobs/server/dtos/dto-to-job-details';

const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const session = await getSession();
    if (!session.apiToken) {
      return jsonError('Not authenticated', 401);
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

    const url = new URL(`${clientEnv.MW_URL}/jobs/suggested`);
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
    const parsed = similarJobDto.safeParse(json);

    if (!parsed.success) {
      return jsonError('Invalid response from backend', 502);
    }

    return NextResponse.json({
      jobs: parsed.data.data.map(dtoToSimilarJob),
    });
  } catch {
    return jsonError('Internal server error', 500);
  }
};
