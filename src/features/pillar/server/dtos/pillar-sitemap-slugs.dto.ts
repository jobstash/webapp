import 'server-only';

import { z } from 'zod';

const pillarSitemapSlugDto = z.object({
  slug: z.string(),
  lastModified: z.string(),
  // Emitted by newer MW versions; used to drop thin pillars from sitemaps.
  jobCount: z.number().optional(),
});

export const pillarSitemapSlugsDto = z.object({
  data: pillarSitemapSlugDto.array(),
});
export type PillarSitemapSlugsDto = z.infer<typeof pillarSitemapSlugsDto>;
