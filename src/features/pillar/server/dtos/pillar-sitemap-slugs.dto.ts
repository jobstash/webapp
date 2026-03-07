import 'server-only';

import { z } from 'zod';

const pillarSitemapSlugDto = z.object({
  slug: z.string(),
  lastModified: z.string(),
});

export const pillarSitemapSlugsDto = z.object({
  data: pillarSitemapSlugDto.array(),
});
export type PillarSitemapSlugsDto = z.infer<typeof pillarSitemapSlugsDto>;
