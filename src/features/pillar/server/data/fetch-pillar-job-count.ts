import 'server-only';

import { z } from 'zod';

import { getApiSlug } from '@/features/pillar/constants';
import { clientEnv } from '@/lib/env/client';

const pillarJobCountDto = z.object({
  totalJobs: z.number().int().nonnegative(),
});

export const fetchPillarJobCount = async (slug: string): Promise<number> => {
  // Match the pillar's visible feed: all eligible open jobs, not the metadata
  // preview, organization-group total, latest import, or a publication window.
  const params = new URLSearchParams({ pillar: getApiSlug(slug), limit: '1' });
  const response = await fetch(`${clientEnv.MW_URL}/jobs/feed?${params}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(
      `Pillar job count fetch failed (${response.status}): ${slug}`,
    );
  }

  // Missing/invalid counts and upstream failures must never become a false zero.
  const json: unknown = await response.json().catch(() => {
    throw new Error(`Pillar job count payload is not valid JSON: ${slug}`);
  });
  const result = pillarJobCountDto.safeParse(json);
  if (!result.success) {
    throw new Error(`Pillar job count payload failed validation: ${slug}`);
  }
  return result.data.totalJobs;
};
