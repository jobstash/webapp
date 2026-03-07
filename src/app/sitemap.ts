import type { MetadataRoute } from 'next';

import { clientEnv } from '@/lib/env/client';
import { fetchJobListPage } from '@/features/jobs/server/data';
import { fetchPillarSitemapSlugs } from '@/features/pillar/server/data';

const FRONTEND_URL = clientEnv.FRONTEND_URL;

export const generateSitemaps = () => [{ id: 0 }, { id: 1 }, { id: 2 }];

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  if (id === 0) return staticSitemap();
  if (id === 1) return pillarSitemap();
  return jobSitemap();
}

function staticSitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: FRONTEND_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
}

async function pillarSitemap(): Promise<MetadataRoute.Sitemap> {
  const params = await fetchPillarSitemapSlugs();

  return params.map(({ slug }) => ({
    url: `${FRONTEND_URL}/${slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));
}

async function jobSitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: jobs } = await fetchJobListPage({ page: 1, limit: 4000 });

  return jobs.map((job) => ({
    url: `${FRONTEND_URL}${job.href}`,
    lastModified: new Date(job.datePosted),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
}
