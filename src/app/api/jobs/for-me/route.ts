import { NextResponse } from 'next/server';
import { z } from 'zod';

import { dtoToJobListItem } from '@/features/jobs/server/dtos';
import { jobListItemDto } from '@/features/jobs/server/dtos/job-list-item.dto';
import {
  jobForMeSchema,
  jobPreferencesSchema,
  jobsForMeResponseSchema,
  jobsForMeSummarySchema,
} from '@/features/profile/job-preferences';
import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';

const upstreamJobForMeSchema = jobForMeSchema
  .omit({ job: true })
  .extend({ job: jobListItemDto });

const upstreamJobsForMeResponseSchema = z.strictObject({
  confirmedMatches: z.array(upstreamJobForMeSchema),
  timezoneNearMisses: z.array(upstreamJobForMeSchema),
  needsChecking: z.array(upstreamJobForMeSchema),
  summary: jobsForMeSummarySchema,
  appliedPreferences: jobPreferencesSchema,
});

const mapMatches = (matches: z.infer<typeof upstreamJobForMeSchema>[]) =>
  matches.map(({ job, ...match }) => ({
    ...match,
    job: dtoToJobListItem(job),
  }));

export const GET = async () => {
  const { apiToken } = await getSession();
  if (!apiToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const response = await fetch(`${clientEnv.MW_URL}/jobs/for-me`, {
    headers: { Authorization: `Bearer ${apiToken}` },
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
  const upstream = upstreamJobsForMeResponseSchema.safeParse(json);
  if (!upstream.success) {
    return NextResponse.json(
      { error: 'The service returned an invalid response' },
      { status: 502 },
    );
  }

  const mapped = jobsForMeResponseSchema.safeParse({
    ...upstream.data,
    confirmedMatches: mapMatches(upstream.data.confirmedMatches),
    timezoneNearMisses: mapMatches(upstream.data.timezoneNearMisses),
    needsChecking: mapMatches(upstream.data.needsChecking),
  });
  if (!mapped.success) {
    return NextResponse.json(
      { error: 'The service returned an invalid response' },
      { status: 502 },
    );
  }

  return NextResponse.json(mapped.data);
};
