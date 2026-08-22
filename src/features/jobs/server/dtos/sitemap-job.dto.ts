import 'server-only';

import { z } from 'zod';

export const sitemapJobDto = z.object({
  shortUUID: z.string(),
  title: z.string().nullable(),
  organizationName: z.string().nullable(),
  // null when MW has no usable date for the job
  timestamp: z.number().nullable(),
});
export type SitemapJobDto = z.infer<typeof sitemapJobDto>;

export const sitemapJobsResponseDto = z.object({
  data: sitemapJobDto.array().optional().default([]),
});
