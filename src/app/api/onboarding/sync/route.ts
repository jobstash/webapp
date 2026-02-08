import { NextResponse } from 'next/server';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';
import { socialKindSchema } from '@/features/onboarding/schemas';
import { SOCIAL_URL_TEMPLATES } from '@/features/profile/constants';
import { getSession } from '@/lib/server/session';

const ROUTE_TAG = '[POST /api/onboarding/sync]';

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
    const label = kind.charAt(0).toUpperCase() + kind.slice(1);
    entries.push({ label, url: template(handle) });
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

export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    const { apiToken } = await getSession();

    if (!apiToken) {
      return jsonError('Not authenticated', 401);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid JSON', 400);
    }

    const parsed = syncRequestSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError('Invalid request', 400);
    }

    const { skills, socials, email, resume } = parsed.data;

    const [skillsResult, showcaseResult] = await Promise.allSettled([
      (async () => {
        if (skills.length === 0) return 'skipped' as const;

        const res = await fetch(`${clientEnv.MW_URL}/profile/skills`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiToken}`,
          },
          body: JSON.stringify({
            skills: skills.map((s) => ({
              id: s.id,
              name: s.name,
              canTeach: false,
            })),
          }),
        });

        if (!res.ok) {
          console.error(`${ROUTE_TAG} Skills sync failed: ${res.status}`);
        }

        return res.ok ? ('synced' as const) : ('failed' as const);
      })(),

      (async () => {
        const showcase = buildShowcase(socials, email, resume);
        if (showcase.length === 0) return 'skipped' as const;

        const res = await fetch(`${clientEnv.MW_URL}/profile/showcase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiToken}`,
          },
          body: JSON.stringify({ showcase }),
        });

        if (!res.ok) {
          console.error(`${ROUTE_TAG} Showcase sync failed: ${res.status}`);
        }

        return res.ok ? ('synced' as const) : ('failed' as const);
      })(),
    ]);

    const summary = {
      skills:
        skillsResult.status === 'fulfilled' ? skillsResult.value : 'failed',
      showcase:
        showcaseResult.status === 'fulfilled' ? showcaseResult.value : 'failed',
    };

    if (skillsResult.status === 'rejected') {
      console.error(`${ROUTE_TAG} Skills sync threw:`, skillsResult.reason);
    }
    if (showcaseResult.status === 'rejected') {
      console.error(`${ROUTE_TAG} Showcase sync threw:`, showcaseResult.reason);
    }

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
