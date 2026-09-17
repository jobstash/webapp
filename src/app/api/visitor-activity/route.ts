import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { clientEnv } from '@/lib/env/client';
import {
  recordVisitorActivity,
  setVisitorCookie,
  visitorIdentity,
  VISITOR_COOKIE,
} from '@/lib/server/visitor-activity';

const schema = z.object({ path: z.string().startsWith('/').max(240) });
export async function POST(req: NextRequest): Promise<NextResponse> {
  // Only the site itself can ask to record browser presence.
  if (req.headers.get('origin') !== new URL(clientEnv.FRONTEND_URL).origin)
    return new NextResponse(null, { status: 403 });
  const input = schema.safeParse(await req.json().catch(() => null));
  if (!input.success) return new NextResponse(null, { status: 400 });
  const identity = visitorIdentity(req.cookies.get(VISITOR_COOKIE)?.value);
  await recordVisitorActivity(req, identity, 'presence', input.data.path);
  const response = new NextResponse(null, { status: 204 });
  setVisitorCookie(response, identity);
  return response;
}
