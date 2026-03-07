import 'server-only';

import { z } from 'zod';

export const sitemapJobDto = z.object({
  shortUUID: z.string(),
  title: z.string().nullable(),
  organizationName: z.string().nullable(),
  timestamp: z.number(),
});
export type SitemapJobDto = z.infer<typeof sitemapJobDto>;

export const sitemapJobsResponseDto = z.object({
  data: sitemapJobDto.array().optional().default([]),
});
