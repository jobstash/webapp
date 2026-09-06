import { recommendationCareerSchema } from '@/features/profile/recommendation-career';
import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';

export const PATCH = async (request: Request) => {
  const session = await getSession();
  if (
    !session.apiToken ||
    (session.expiresAt !== undefined && session.expiresAt <= Date.now())
  ) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const parsed = recommendationCareerSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return Response.json({ error: 'Invalid career data' }, { status: 400 });
  const response = await fetch(
    `${clientEnv.MW_URL}/profile/recommendation-career`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsed.data),
    },
  ).catch(() => null);
  if (!response)
    return Response.json({ error: 'Service unavailable' }, { status: 502 });
  const body = await response.json().catch(() => null);
  if (!body)
    return Response.json(
      { error: 'Invalid service response' },
      { status: 502 },
    );
  return Response.json(body, { status: response.status });
};
