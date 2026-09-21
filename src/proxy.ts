import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from 'next/server';
import {
  recordVisitorActivity,
  setVisitorCookie,
  visitorIdentity,
  VISITOR_COOKIE,
} from '@/lib/server/visitor-activity';

export function proxy(req: NextRequest, event: NextFetchEvent): NextResponse {
  const headers = new Headers(req.headers);
  headers.set(
    'x-jobstash-request-path',
    req.nextUrl.pathname + req.nextUrl.search,
  );
  const response = NextResponse.next({ request: { headers } });
  if (!process.env.VISITOR_INGEST_SECRET) return response;
  // Skip browser prefetches; these are not visits.
  if (
    req.headers.has('next-router-prefetch') ||
    req.headers.get('purpose') === 'prefetch'
  )
    return response;
  const identity = visitorIdentity(req.cookies.get(VISITOR_COOKIE)?.value);
  setVisitorCookie(response, identity);
  event.waitUntil(
    recordVisitorActivity(req, identity, 'request', req.nextUrl.pathname),
  );
  return response;
}
export const config = {
  matcher: [
    '/((?!_next|api/visitor-activity|favicon.ico|robots.txt|sitemap|.*\\.[a-zA-Z0-9]+$).*)',
  ],
};
