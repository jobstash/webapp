import { buildUrlsetResponse } from '@/lib/server/sitemap/build-sitemap-xml';
import { getJobsChunk, getPillarsChunk } from '@/lib/server/sitemap/chunks';
import { clientEnv } from '@/lib/env/client';

export const revalidate = 3600;

const ID_REGEX = /^(jobs|pillars)-(\d+)$/;

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params;

  if (id === 'static') {
    return buildUrlsetResponse([{ loc: clientEnv.FRONTEND_URL }]);
  }

  const match = ID_REGEX.exec(id);
  if (!match) return new Response('Not Found', { status: 404 });

  const [, kind, chunkText] = match;
  const chunk = Number(chunkText);
  if (chunk < 1) return new Response('Not Found', { status: 404 });

  // Out-of-range chunks return an empty (valid) urlset instead of 404 so a
  // stale sitemap index never points crawlers at a broken URL.
  const entries =
    kind === 'jobs' ? await getJobsChunk(chunk) : await getPillarsChunk(chunk);

  return buildUrlsetResponse(entries);
}
