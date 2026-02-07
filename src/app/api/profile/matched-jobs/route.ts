import { NextResponse } from 'next/server';
import { z } from 'zod';

import { MAX_MATCH_SKILLS } from '@/lib/constants';
import { clientEnv } from '@/lib/env/client';
import { nonEmptyStringSchema, nullableStringSchema } from '@/lib/schemas';
import { getSession } from '@/lib/server/session';

const MATCH_LIMIT = 10;

const jobListItemDto = z.object({
  shortUUID: z.string(),
  title: nonEmptyStringSchema,
  organization: z
    .object({ name: nonEmptyStringSchema, logoUrl: nullableStringSchema })
    .nullable(),
});

const jobListResponseDto = z.object({
  data: jobListItemDto.array(),
});

const matchResponseDto = z.object({
  success: z.boolean(),
  data: z.object({
    score: z.number(),
    category: nonEmptyStringSchema,
  }),
});

interface MatchedJob {
  shortUuid: string;
  title: string;
  orgName: string | null;
  orgLogo: string | null;
  match: { score: number; category: string };
}

const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

export const GET = async (): Promise<NextResponse> => {
  try {
    const session = await getSession();
    if (!session.apiToken) {
      return jsonError('Not authenticated', 401);
    }

    // 1. Get user skills
    const skillsRes = await fetch(`${clientEnv.MW_URL}/profile/skills`, {
      headers: { Authorization: `Bearer ${session.apiToken}` },
    }).catch(() => null);

    if (!skillsRes?.ok) {
      return jsonError('Failed to fetch skills', 502);
    }

    const skillsJson: unknown = await skillsRes.json().catch(() => null);
    const skillsData = z
      .object({
        data: z.object({ normalizedName: nonEmptyStringSchema }).array(),
      })
      .safeParse(skillsJson);

    if (!skillsData.success || skillsData.data.data.length === 0) {
      return NextResponse.json({ jobs: [] });
    }

    const skillNames = skillsData.data.data
      .map((s) => s.normalizedName)
      .sort()
      .slice(0, MAX_MATCH_SKILLS);

    // 2. Get first page of jobs
    const jobsUrl = new URL(`${clientEnv.MW_URL}/jobs/list`);
    jobsUrl.searchParams.set('page', '1');
    jobsUrl.searchParams.set('limit', String(MATCH_LIMIT));

    const jobsRes = await fetch(jobsUrl).catch(() => null);
    if (!jobsRes?.ok) {
      return jsonError('Failed to fetch jobs', 502);
    }

    const jobsJson: unknown = await jobsRes.json().catch(() => null);
    const jobsParsed = jobListResponseDto.safeParse(jobsJson);

    if (!jobsParsed.success || jobsParsed.data.data.length === 0) {
      return NextResponse.json({ jobs: [] });
    }

    // 3. Match each job
    const matchPromises = jobsParsed.data.data.map(
      async (job): Promise<MatchedJob | null> => {
        const matchUrl = new URL(
          `${clientEnv.MW_URL}/jobs/match/${job.shortUUID}`,
        );
        matchUrl.searchParams.set('skills', skillNames.join(','));
        matchUrl.searchParams.set(
          'isExpert',
          String(session.isExpert ?? false),
        );

        const matchRes = await fetch(matchUrl, {
          headers: { Authorization: `Bearer ${session.apiToken!}` },
        }).catch(() => null);

        if (!matchRes?.ok) return null;

        const matchJson: unknown = await matchRes.json().catch(() => null);
        const matchParsed = matchResponseDto.safeParse(matchJson);
        if (!matchParsed.success) return null;

        return {
          shortUuid: job.shortUUID,
          title: job.title,
          orgName: job.organization?.name ?? null,
          orgLogo: job.organization?.logoUrl ?? null,
          match: matchParsed.data.data,
        };
      },
    );

    const results = await Promise.all(matchPromises);
    const matched = results
      .filter((r): r is MatchedJob => r !== null)
      .sort((a, b) => b.match.score - a.match.score);

    return NextResponse.json({ jobs: matched });
  } catch {
    return jsonError('Internal server error', 500);
  }
};
