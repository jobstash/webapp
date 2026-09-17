import { isIP } from 'node:net';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { unsealData } from 'iron-session';
import type { NextRequest, NextResponse } from 'next/server';
import { clientEnv } from '@/lib/env/client';
import type { SessionData } from '@/lib/server/session';

export const VISITOR_COOKIE = 'jobstash-visitor';
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const mac = (value: string) =>
  createHmac('sha256', process.env.SESSION_SECRET ?? '')
    .update(value)
    .digest('hex');

export function visitorIdentity(cookie: string | undefined): {
  id: string;
  cookie: string;
  fresh: boolean;
} {
  const [id, signature] = (cookie ?? '').split('.');
  if (
    uuid.test(id ?? '') &&
    /^[a-f0-9]{64}$/.test(signature ?? '') &&
    timingSafeEqual(Buffer.from(mac(id), 'hex'), Buffer.from(signature, 'hex'))
  ) {
    return { id, cookie: cookie!, fresh: false };
  }
  const freshId = randomUUID();
  return { id: freshId, cookie: `${freshId}.${mac(freshId)}`, fresh: true };
}

export function setVisitorCookie(
  response: NextResponse,
  identity: ReturnType<typeof visitorIdentity>,
): void {
  if (!identity.fresh) return;
  response.cookies.set(VISITOR_COOKIE, identity.cookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 86400,
  });
}

// Never keep searches, tokens, query strings, document IDs or profile subpaths.
export function visitorPath(path: string): string {
  const pathname = path.split(/[?#]/)[0];
  if (
    /^\/(profile|api\/profile|api\/resume|api\/career-agent)(\/|$)/.test(
      pathname,
    )
  )
    return '/profile';
  if (!/^\/[a-zA-Z0-9/_\-.]*$/.test(pathname)) return '/other';
  return pathname.slice(0, 240);
}

export async function recordVisitorActivity(
  req: NextRequest,
  identity: ReturnType<typeof visitorIdentity>,
  kind: 'request' | 'presence' | 'job_view',
  path: string,
): Promise<void> {
  const secret = process.env.VISITOR_INGEST_SECRET;
  if (!secret || secret.length < 32) return;
  let token: string | undefined;
  try {
    const cookie = req.cookies.get('jobstash-session')?.value;
    if (cookie && process.env.SESSION_SECRET) {
      const session = await unsealData<SessionData>(cookie, {
        password: process.env.SESSION_SECRET,
      });
      if (session.expiresAt && session.expiresAt > Date.now())
        token = session.apiToken;
    }
  } catch {
    /* A missing or expired login remains anonymous. */
  }
  // These headers must be overwritten by the trusted reverse proxy. They are
  // deliberately disabled until the deployment explicitly configures them.
  const ipHeader = process.env.VISITOR_TRUSTED_IP_HEADER;
  const countryHeader = process.env.VISITOR_TRUSTED_COUNTRY_HEADER;
  const ip = ipHeader ? req.headers.get(ipHeader)?.trim() : undefined;
  // Health checks inside the container bypass the public proxy.
  if (ipHeader && (!ip || !isIP(ip))) return;
  const country = countryHeader
    ? req.headers.get(countryHeader)?.toUpperCase()
    : undefined;
  const body = JSON.stringify({
    visitorId: identity.id,
    kind,
    path: visitorPath(path),
    ...(ip && isIP(ip)
      ? {
          ip,
          networkKey: createHmac('sha256', secret)
            .update(`network:${ip}`)
            .digest('hex'),
        }
      : {}),
    ...(country && /^[A-Z]{2}$/.test(country) ? { country } : {}),
    browser: (req.headers.get('user-agent') ?? '').slice(0, 1024),
  });
  const authorization = token ? `Bearer ${token}` : '';
  const timestamp = String(Date.now());
  const signature = createHmac('sha256', secret)
    .update(`${timestamp}.${authorization}.${body}`)
    .digest('hex');
  try {
    const response = await fetch(
      `${clientEnv.MW_URL}/telemetry/visitors/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
          'x-visitor-time': timestamp,
          'x-visitor-signature': signature,
        },
        body,
        signal: AbortSignal.timeout(1500),
        cache: 'no-store',
      },
    );
    if (!response.ok)
      console.warn('Visitor activity write failed', response.status);
  } catch {
    /* Reporting must never prevent browsing or signing in. */
  }
}
