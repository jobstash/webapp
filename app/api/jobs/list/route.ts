import { NextRequest, NextResponse } from 'next/server';

import { fetchJobListPage } from '@/lib/jobs/server/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!, 10)
      : undefined;

    const otherParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'page' && key !== 'limit') {
        otherParams[key] = value;
      }
    });

    const result = await fetchJobListPage({
      page,
      limit,
      searchParams: Object.keys(otherParams).length > 0 ? otherParams : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/jobs/list:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
