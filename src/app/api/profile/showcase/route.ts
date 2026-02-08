import { NextResponse } from 'next/server';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';
import { getSession } from '@/lib/server/session';

const ROUTE_TAG_GET = '[GET /api/profile/showcase]';
const ROUTE_TAG_POST = '[POST /api/profile/showcase]';

const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

const showcaseResponseSchema = z.object({
  data: z.array(
    z.object({
      label: z.string(),
      url: z.string(),
    }),
  ),
});

export const GET = async (): Promise<NextResponse> => {
  try {
    const { apiToken } = await getSession();

    if (!apiToken) {
      return jsonError('Not authenticated', 401);
    }

    let res: Response;
    try {
      res = await fetch(`${clientEnv.MW_URL}/profile/showcase`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
    } catch (error) {
      console.error(`${ROUTE_TAG_GET} Backend connection failed:`, error);
      return jsonError('Failed to connect to backend', 502);
    }

    if (!res.ok) {
      console.error(`${ROUTE_TAG_GET} Backend returned ${res.status}`);
      return jsonError(
        'Failed to fetch showcase',
        res.status >= 500 ? 502 : res.status,
      );
    }

    let json: unknown;
    try {
      json = await res.json();
    } catch {
      return jsonError('Invalid response from backend', 502);
    }

    const parsed = showcaseResponseSchema.safeParse(json);
    if (!parsed.success) {
      console.error(
        `${ROUTE_TAG_GET} Invalid backend response:`,
        parsed.error.flatten(),
      );
      return jsonError('Invalid response format from backend', 502);
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error(`${ROUTE_TAG_GET} Unexpected error:`, error);
    return jsonError('Internal server error', 500);
  }
};

const postBodySchema = z.object({
  showcase: z.array(
    z.object({
      label: z.string().min(1),
      url: z.string().min(1),
    }),
  ),
});

export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    const { apiToken } = await getSession();

    if (!apiToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = postBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    let res: Response;
    try {
      res = await fetch(`${clientEnv.MW_URL}/profile/showcase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({ showcase: parsed.data.showcase }),
      });
    } catch (error) {
      console.error(`${ROUTE_TAG_POST} Backend connection failed:`, error);
      return NextResponse.json(
        { error: 'Failed to connect to backend' },
        { status: 502 },
      );
    }

    if (!res.ok) {
      console.error(`${ROUTE_TAG_POST} Backend returned ${res.status}`);
      return NextResponse.json(
        { error: `Backend returned ${res.status}` },
        { status: res.status >= 500 ? 502 : res.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`${ROUTE_TAG_POST} Unexpected error:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
};
