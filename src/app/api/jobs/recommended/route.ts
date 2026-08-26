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
  jobs: z.array(z.unknown()),
});

const upstreamItemSchema = z.object({
  job: jobListItemDto,
  reason: z.string().min(1),
});

export const GET = async () => {
  const { apiToken } = await getSession();
  if (!apiToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const response = await fetch(`${clientEnv.MW_URL}/jobs/recommended`, {
    headers: { Authorization: `Bearer ${apiToken}` },
    cache: 'no-store',
  }).catch(() => null);
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
    recommendedJobsResponseSchema.parse({ jobs, total: jobs.length }),
  );
};
