import { NextRequest, NextResponse } from 'next/server';

import { fetchJobDetails } from '@/lib/jobs/server/data';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const result = await fetchJobDetails(id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/jobs/details/[id]:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
