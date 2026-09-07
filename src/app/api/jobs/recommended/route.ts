import { NextResponse } from 'next/server';
import { z } from 'zod';

import { dtoToJobListItem } from '@/features/jobs/server/dtos';
import { jobListItemDto } from '@/features/jobs/server/dtos/job-list-item.dto';
import {
  recommendedJobSchema,
  recommendedJobsResponseSchema,
} from '@/features/profile/recommended-jobs';
import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';

const upstreamResponseSchema = z.object({
  rankingVersion: z.string().default('legacy'),
  jobs: z.array(z.unknown()),
  total: z.number().int().nonnegative().optional(),
  page: z.number().int().positive().default(1),
  hasMore: z.boolean().default(false),
  rankedAt: z.string().datetime().optional(),
});

const upstreamItemSchema = z.object({
  job: jobListItemDto,
  reason: z.string().min(1),
});

export const GET = async (request: Request) => {
  const { apiToken } = await getSession();
  if (!apiToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const page = z.coerce
    .number()
    .int()
    .min(1)
    .max(1_000_000)
    .catch(1)
    .parse(new URL(request.url).searchParams.get('page') ?? 1);
  const rankedAt = z
    .string()
    .datetime()
    .optional()
    .catch(undefined)
    .parse(new URL(request.url).searchParams.get('rankedAt') ?? undefined);
  const query = new URLSearchParams({ page: String(page) });
  if (rankedAt) query.set('rankedAt', rankedAt);
  const response = await fetch(
    `${clientEnv.MW_URL}/jobs/recommended?${query}`,
    {
      headers: { Authorization: `Bearer ${apiToken}` },
      cache: 'no-store',
    },
  ).catch(() => null);
  if (!response) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }

  const json: unknown = await response.json().catch(() => null);
  if (!response.ok) return NextResponse.json(json, { status: response.status });

  const upstream = upstreamResponseSchema.safeParse(json);
  if (!upstream.success) {
    return NextResponse.json({ error: 'Invalid response' }, { status: 502 });
  }

  const jobs = upstream.data.jobs.flatMap((raw) => {
    const item = upstreamItemSchema.safeParse(raw);
    if (!item.success) return [];
    try {
      const mapped = recommendedJobSchema.safeParse({
        job: dtoToJobListItem(item.data.job),
        reason: item.data.reason,
      });
      return mapped.success ? [mapped.data] : [];
    } catch {
      return [];
    }
  });

  return NextResponse.json(
    recommendedJobsResponseSchema.parse({
      jobs,
      total:
        upstream.data.total === undefined
          ? jobs.length
          : Math.max(
              jobs.length,
              upstream.data.total - upstream.data.jobs.length + jobs.length,
            ),
      page: upstream.data.page,
      hasMore: upstream.data.hasMore,
      rankedAt: upstream.data.rankedAt,
      rankingVersion: upstream.data.rankingVersion,
    }),
  );
};
