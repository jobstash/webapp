import { type NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { MAX_MATCH_SKILLS } from '@/lib/constants';
import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';
import { jobListPageDto } from '@/features/jobs/server/dtos/job-list-page.dto';
import { dtoToJobListPage } from '@/features/jobs/server/dtos/dto-to-job-list-page';

const mwResponseDto = z.object({
  success: z.boolean(),
  message: z.string(),
  data: jobListPageDto,
});

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

    const page = Math.max(1, Number(req.nextUrl.searchParams.get('page')) || 1);

    const url = new URL(`${clientEnv.MW_URL}/jobs/suggested`);
    url.searchParams.set('skills', skills.join(','));
    url.searchParams.set('isExpert', String(session.isExpert ?? false));
    url.searchParams.set('page', String(page));

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
    const parsed = mwResponseDto.safeParse(json);

    if (!parsed.success) {
      return jsonError('Invalid response from backend', 502);
    }

    const { page: mwPage, count, total } = parsed.data.data;
    const jobListPage = dtoToJobListPage(parsed.data.data);
    const hasMore = mwPage * count < total;

    return NextResponse.json({
      page: mwPage,
      total,
      data: jobListPage.data,
      hasMore,
    });
  } catch {
    return jsonError('Internal server error', 500);
  }
};
