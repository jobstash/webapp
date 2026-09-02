import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Dependency = { status: 'up' | 'down'; responseTimeMs: number };

export const GET = async () => {
  const startedAt = Date.now();
  const middlewareStartedAt = Date.now();
  const middlewareUrl = process.env.NEXT_PUBLIC_MW_URL;
  let middleware: Dependency = { status: 'down', responseTimeMs: 0 };

  if (middlewareUrl) {
    try {
      const response = await fetch(`${middlewareUrl}/health/ready`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(1_500),
      });
      middleware = {
        status: response.ok ? 'up' : 'down',
        responseTimeMs: Date.now() - middlewareStartedAt,
      };
    } catch {
      middleware = {
        status: 'down',
        responseTimeMs: Date.now() - middlewareStartedAt,
      };
    }
  }

  const configuration: Dependency = {
    status:
      middlewareUrl && process.env.NEXT_PUBLIC_FRONTEND_URL ? 'up' : 'down',
    responseTimeMs: 0,
  };
  const dependencies = { configuration, middleware };
  // A transient downstream outage must not remove every frontend replica
  // from the proxy. The process is ready when its own configuration is valid;
  // middleware health remains visible here as a degraded dependency.
  const ready = configuration.status === 'up';

  return NextResponse.json(
    {
      status: ready ? 'ready' : 'not_ready',
      service: 'jobstash-webapp',
      environment: process.env.APP_ENV ?? process.env.NODE_ENV ?? 'unknown',
      responseTimeMs: Date.now() - startedAt,
      instanceRole: process.env.INSTANCE_ROLE ?? 'frontend',
      dependencies,
    },
    {
      status: ready ? 200 : 503,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    },
  );
};
