import { NextResponse } from 'next/server';
import { fetchJobsRevision } from '@/features/jobs/server/data/fetch-jobs-revision';

export const GET = async () => {
  try {
    return NextResponse.json(
      { revision: await fetchJobsRevision() },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { error: 'Job update status unavailable' },
      { status: 503 },
    );
  }
};
