import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const proxy = (_request: NextRequest): NextResponse => {
  const response = NextResponse.next();

  // Add version header for client staleness detection
  const version = process.env.NEXT_PUBLIC_APP_VERSION || 'unknown';
  response.headers.set('X-App-Version', version);

  return response;
};

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
};
