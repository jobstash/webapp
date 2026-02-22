import { NextResponse } from 'next/server';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';
import { socialKindSchema } from '@/features/profile/schemas';
import {
  getSocialLabel,
  SOCIAL_URL_TEMPLATES,
} from '@/features/profile/constants';
import { getSession } from '@/lib/server/session';

const ROUTE_TAG = '[POST /api/profile/sync]';

const jsonError = (error: string, status: number) =>
  NextResponse.json({ success: false, error }, { status });

const syncRequestSchema = z.object({
  skills: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string().min(1),
    }),
  ),
  socials: z.array(
    z.object({
      kind: socialKindSchema,
      handle: z.string().min(1),
    }),
  ),
  email: z.string().email().nullable(),
  resume: z
    .object({
      resumeId: z.string().uuid(),
      fileName: z.string().min(1),
    })
    .nullable(),
});

const buildShowcase = (
  socials: { kind: string; handle: string }[],
  email: string | null,
  resume: { resumeId: string; fileName: string } | null,
): { label: string; url: string }[] => {
  const entries: { label: string; url: string }[] = [];

  for (const { kind, handle } of socials) {
    if (!handle) continue;
    const template = SOCIAL_URL_TEMPLATES[kind];
    if (!template) continue;
    entries.push({ label: getSocialLabel(kind), url: template(handle) });
  }

  if (email) {
    entries.push({ label: 'Email', url: email });
  }

  if (resume) {
    entries.push({
      label: 'CV',
      url: `${clientEnv.FRONTEND_URL}/api/resume/${resume.resumeId}`,
    });
  }

  return entries;
};

type SyncStatus = 'synced' | 'skipped' | 'failed';

const mwPost = async (apiToken: string, path: string, body: unknown) => {
  try {
    return await fetch(`${clientEnv.MW_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error(`${ROUTE_TAG} Backend connection failed for ${path}:`, error);
    return null;
  }
};

const syncSkills = async (
  apiToken: string,
  skills: { id: string; name: string }[],
): Promise<SyncStatus> => {
  if (skills.length === 0) return 'skipped';

  const res = await mwPost(apiToken, '/profile/skills', {
    skills: skills.map((s) => ({ id: s.id, name: s.name, canTeach: false })),
  });

  if (!res) return 'failed';
  if (!res.ok) console.error(`${ROUTE_TAG} Skills sync failed: ${res.status}`);

  return res.ok ? 'synced' : 'failed';
};

const syncShowcase = async (
  apiToken: string,
  socials: { kind: string; handle: string }[],
  email: string | null,
  resume: { resumeId: string; fileName: string } | null,
): Promise<SyncStatus> => {
  const showcase = buildShowcase(socials, email, resume);
  if (showcase.length === 0) return 'skipped';

  const res = await mwPost(apiToken, '/profile/showcase', { showcase });

  if (!res) return 'failed';
  if (!res.ok)
    console.error(`${ROUTE_TAG} Showcase sync failed: ${res.status}`);

  return res.ok ? 'synced' : 'failed';
};

export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    const session = await getSession();
    const isExpired =
      session.expiresAt !== undefined && session.expiresAt <= Date.now();

    if (!session.apiToken || isExpired) {
      if (isExpired) session.destroy();
      return jsonError('Not authenticated', 401);
    }

    const { apiToken } = session;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid JSON', 400);
    }

    const parsed = syncRequestSchema.safeParse(body);
    if (!parsed.success) {
      console.error(`${ROUTE_TAG} Validation failed:`, parsed.error.flatten());
      return jsonError('Invalid request', 400);
    }

    const { skills, socials, email, resume } = parsed.data;

    const [skillsResult, showcaseResult] = await Promise.allSettled([
      syncSkills(apiToken, skills),
      syncShowcase(apiToken, socials, email, resume),
    ]);

    const resolve = (
      result: PromiseSettledResult<SyncStatus>,
      label: string,
    ): SyncStatus => {
      if (result.status === 'fulfilled') return result.value;
      console.error(`${ROUTE_TAG} ${label} sync threw:`, result.reason);
      return 'failed';
    };

    const summary = {
      skills: resolve(skillsResult, 'Skills'),
      showcase: resolve(showcaseResult, 'Showcase'),
    };

    const hasFailure =
      summary.skills === 'failed' || summary.showcase === 'failed';

    return NextResponse.json(
      { success: !hasFailure, results: summary },
      hasFailure ? { status: 207 } : undefined,
    );
  } catch (error) {
    console.error(`${ROUTE_TAG} Unexpected error:`, error);
    return jsonError('Internal server error', 500);
  }
};
