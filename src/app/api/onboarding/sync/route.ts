import { NextResponse } from 'next/server';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';
import { socialKindSchema } from '@/features/onboarding/schemas';
import { getSession } from '@/lib/server/session';

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

const SOCIAL_URL_TEMPLATES: Record<string, (handle: string) => string> = {
  github: (h) => (h.startsWith('http') ? h : `https://github.com/${h}`),
  linkedin: (h) => (h.startsWith('http') ? h : `https://linkedin.com/in/${h}`),
  twitter: (h) => (h.startsWith('http') ? h : `https://x.com/${h}`),
  telegram: (h) => (h.startsWith('http') ? h : `https://t.me/${h}`),
  discord: (h) => h,
  website: (h) => (h.startsWith('http') ? h : `https://${h}`),
  farcaster: (h) => (h.startsWith('http') ? h : `https://warpcast.com/${h}`),
  lens: (h) => (h.startsWith('http') ? h : `https://hey.xyz/profile/${h}`),
};

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
    const session = await getSession();
    const apiToken = session.apiToken;

    if (!apiToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = syncRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { skills, socials, email, resume } = parsed.data;

    const [skillsResult, showcaseResult] = await Promise.allSettled([
      // Sync skills
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

        return res.ok ? ('synced' as const) : ('failed' as const);
      })(),

      // Sync showcase
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

        return res.ok ? ('synced' as const) : ('failed' as const);
      })(),
    ]);

    const summary = {
      skills:
        skillsResult.status === 'fulfilled' ? skillsResult.value : 'failed',
      showcase:
        showcaseResult.status === 'fulfilled' ? showcaseResult.value : 'failed',
    };

    const hasFailure =
      summary.skills === 'failed' || summary.showcase === 'failed';

    return NextResponse.json({ success: !hasFailure, results: summary });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
};
