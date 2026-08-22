import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const base = (status: 'live' | 'ready' | 'not_ready', startedAt: number) => ({
  status,
  service: 'jobstash-webapp',
  environment: process.env.APP_ENV ?? process.env.NODE_ENV ?? 'unknown',
  releaseSha: process.env.RELEASE_SHA ?? 'unknown',
  imageDigest: process.env.IMAGE_DIGEST ?? 'unknown',
  buildTime: process.env.BUILD_TIME ?? 'unknown',
  responseTimeMs: Date.now() - startedAt,
  instanceRole: process.env.INSTANCE_ROLE ?? 'frontend',
  dependencies: {},
});

export const GET = () => {
  const startedAt = Date.now();
  return NextResponse.json(base('live', startedAt), {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
};
