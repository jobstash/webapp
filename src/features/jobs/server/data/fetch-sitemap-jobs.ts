import 'server-only';

import {
  sitemapJobsResponseDto,
  type SitemapJobDto,
} from '@/features/jobs/server/dtos/sitemap-job.dto';
import { clientEnv } from '@/lib/env/client';
import { slugify } from '@/lib/server/utils';

export const fetchSitemapJobs = async () => {
  const url = `${clientEnv.MW_URL}/v2/search/sitemap/jobs`;
  const response = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error('Failed to fetch sitemap jobs');

  const json = await response.json();
  const parsed = sitemapJobsResponseDto.safeParse(json);
  if (!parsed.success) throw new Error('Failed to parse sitemap jobs');

  return parsed.data.data.map((job) => ({
    href: createSitemapJobHref(job),
    lastModified: new Date(job.timestamp),
  }));
};

const createSitemapJobHref = (job: SitemapJobDto) => {
  const title = job.title ?? 'Open Role';
  const orgText = job.organizationName ? `-${job.organizationName}` : '';
  return `/${slugify(`${title}${orgText}`)}/${job.shortUUID}`;
};
