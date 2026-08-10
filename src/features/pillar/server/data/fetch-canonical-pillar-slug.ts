import 'server-only';

import { clientEnv } from '@/lib/env/client';

export const fetchCanonicalPillarSlug = async (
  slug: string,
): Promise<string | null> => {
  try {
    if (slug.startsWith('t-')) {
      const input = slug.slice(2);
      const response = await fetch(
        `${clientEnv.MW_URL}/tags/resolve?slug=${encodeURIComponent(input)}`,
        { next: { revalidate: 3600 } },
      );
      if (!response.ok) return null;
      const result = (await response.json()) as {
        canonical?: { normalizedName?: string };
        redirected?: boolean;
      } | null;
      const canonical = result?.canonical?.normalizedName;
      return result?.redirected && canonical ? `t-${canonical}` : null;
    }

    if (slug.startsWith('l-')) {
      const input = slug.slice(2);
      const response = await fetch(
        `${clientEnv.MW_URL}/search/pillar/location/resolve?value=${encodeURIComponent(input)}`,
        { cache: 'no-store' },
      );
      if (!response.ok) return null;
      const result = (await response.json()) as {
        canonicalSlug?: string;
      } | null;
      return result?.canonicalSlug && result.canonicalSlug !== input
        ? `l-${result.canonicalSlug}`
        : null;
    }
  } catch {
    return null;
  }
  return null;
};
