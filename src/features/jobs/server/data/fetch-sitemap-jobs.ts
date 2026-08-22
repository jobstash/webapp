import 'server-only';

import {
  sitemapJobsResponseDto,
  type SitemapJobDto,
} from '@/features/jobs/server/dtos/sitemap-job.dto';
import { clientEnv } from '@/lib/env/client';
import { slugify } from '@/lib/server/utils';

// lastmod sanity floor: anything before 2000-01-01 is a data artifact
// (epoch-0 placeholders), not a real date. A wrong lastmod is worse than
// none — Google stops trusting the sitemap's lastmod signals entirely.
const MIN_VALID_TIMESTAMP = Date.UTC(2000, 0, 1);

export interface SitemapJobEntry {
  href: string;
  lastModified?: Date;
}

export const toSitemapEntries = (jobs: SitemapJobDto[]): SitemapJobEntry[] => {
  const byHref = new Map<string, SitemapJobEntry>();

  for (const job of jobs) {
    const href = createSitemapJobHref(job);
    const isValidDate =
      typeof job.timestamp === 'number' && job.timestamp >= MIN_VALID_TIMESTAMP;
    const lastModified = isValidDate
      ? new Date(job.timestamp as number)
      : undefined;

    const existing = byHref.get(href);
    const keepNew =
      !existing ||
      (lastModified &&
        (!existing.lastModified || lastModified > existing.lastModified));
    if (keepNew) byHref.set(href, { href, lastModified });
  }

  return [...byHref.values()];
};

export const fetchSitemapJobs = async (): Promise<SitemapJobEntry[]> => {
  const url = `${clientEnv.MW_URL}/v2/search/sitemap/jobs`;
  const response = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error('Failed to fetch sitemap jobs');

  const json = await response.json();
  const parsed = sitemapJobsResponseDto.safeParse(json);
  if (!parsed.success) throw new Error('Failed to parse sitemap jobs');

  return toSitemapEntries(parsed.data.data);
};

const createSitemapJobHref = (job: SitemapJobDto) => {
  const title = job.title ?? 'Open Role';
  const orgText = job.organizationName ? `-${job.organizationName}` : '';
  return `/${slugify(`${title}${orgText}`)}/${job.shortUUID}`;
};
