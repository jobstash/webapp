import { clientEnv } from '@/lib/env/client';

import { suggestionsResponseSchema } from '@/features/search/schemas';
import { suggestionsRequestSchema } from '@/features/search/server/schemas';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = suggestionsRequestSchema.safeParse({
    q: searchParams.get('q') ?? '',
    group: searchParams.get('group') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  });

  if (!parsed.success) {
    console.error(
      '[API /search/suggestions] Invalid request:',
      parsed.error.flatten(),
    );
    return Response.json(
      { error: 'Invalid request parameters' },
      { status: 400 },
    );
  }

  const { q, group, page, limit } = parsed.data;

  const url = new URL(`${clientEnv.MW_URL}/search/jobs/suggestions`);
  url.searchParams.set('q', q);
  if (group) url.searchParams.set('group', group);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));

  let res;
  try {
    res = await fetch(url.toString());
  } catch {
    return Response.json(
      { error: 'Failed to connect to backend' },
      { status: 502 },
    );
  }

  if (!res.ok) {
    return Response.json(
      { error: `Backend returned ${res.status}` },
      { status: res.status >= 500 ? 502 : res.status },
    );
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return Response.json(
      { error: 'Invalid response from backend' },
      { status: 502 },
    );
  }

  const response = suggestionsResponseSchema.safeParse(json);
  if (!response.success) {
    console.error(
      '[API /search/suggestions] Invalid backend response:',
      response.error.flatten(),
    );
    return Response.json(
      { error: 'Invalid response format from backend' },
      { status: 502 },
    );
  }

  return Response.json(response.data);
}
