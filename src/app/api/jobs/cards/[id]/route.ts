import { NextResponse } from 'next/server';
import { clientEnv } from '@/lib/env/client';
import { jobListItemDto } from '@/features/jobs/server/dtos/job-list-item.dto';
import { dtoToJobListItem } from '@/features/jobs/server/dtos/dto-to-job-list-item';

// Reuse the public job detail lookup; stacks need only the existing card fields.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id))
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  try {
    const response = await fetch(
      `${clientEnv.MW_URL}/jobs/details/${encodeURIComponent(id)}`,
      { cache: 'no-store' },
    );
    if (response.status === 404)
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    if (!response.ok) throw new Error('Job lookup failed');
    const job = jobListItemDto.parse(await response.json());
    if (job.shortUUID !== id) throw new Error('Job lookup mismatch');
    return NextResponse.json(dtoToJobListItem(job), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Job unavailable' }, { status: 502 });
  }
}
