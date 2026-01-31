import type { MetadataRoute } from 'next';

import { clientEnv } from '@/lib/env/client';

const robots = (): MetadataRoute.Robots => {
  if (!clientEnv.ALLOW_INDEXING) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${clientEnv.FRONTEND_URL}/sitemap.xml`,
  };
};

export default robots;
