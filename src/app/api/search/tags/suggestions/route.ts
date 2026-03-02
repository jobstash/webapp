import { type NextRequest, NextResponse } from 'next/server';

import { clientEnv } from '@/lib/env/client';
import { popularTagsResponseSchema } from '@/features/profile/schemas';

const ROUTE_TAG = '[GET /api/search/tags/suggestions]';

const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = req.nextUrl;
    const q = searchParams.get('q') ?? '';
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '20';

    const url = new URL('/search/tags/suggestions', clientEnv.MW_URL);
    url.searchParams.set('q', q);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);

    let res: Response;
    try {
      res = await fetch(url);
    } catch (error) {
      console.error(`${ROUTE_TAG} Backend connection failed:`, error);
      return jsonError('Failed to connect to backend', 502);
    }

    if (!res.ok) {
      console.error(`${ROUTE_TAG} Backend returned ${res.status}`);
      return jsonError(
        'Failed to fetch tag suggestions',
        res.status >= 500 ? 502 : res.status,
      );
    }

    let json: unknown;
    try {
      json = await res.json();
    } catch {
      return jsonError('Invalid response from backend', 502);
    }

    const parsed = popularTagsResponseSchema.safeParse(json);
    if (!parsed.success) {
      console.error(
        `${ROUTE_TAG} Invalid backend response:`,
        parsed.error.flatten(),
      );
      return jsonError('Invalid response format from backend', 502);
    }

    return NextResponse.json(parsed.data.data);
  } catch (error) {
    console.error(`${ROUTE_TAG} Unexpected error:`, error);
    return jsonError('Internal server error', 500);
  }
};
