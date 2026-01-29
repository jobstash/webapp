import 'server-only';

import { clientEnv } from '@/lib/env/client';
import {
  type SimilarJobItemDto,
  similarJobDto,
} from '@/features/jobs/server/dtos';

export const fetchSimilarJobs = async (
  id: string,
): Promise<SimilarJobItemDto[]> => {
  if (!id) return [];

  const url = `${clientEnv.MW_URL}/jobs/similar/${encodeURIComponent(id)}`;

  try {
    const response = await fetch(url, {
      cache: 'force-cache',
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(
        `[fetchSimilarJobs] HTTP ${response.status} for id="${id}"`,
      );
      return [];
    }

    const json = await response.json();
    const parsed = similarJobDto.safeParse(json);

    if (!parsed.success) {
      console.error(
        '[fetchSimilarJobs] Validation failed:',
        parsed.error.flatten(),
      );
      return [];
    }

    if (!parsed.data.success) {
      console.error(
        `[fetchSimilarJobs] API returned success=false: ${parsed.data.message}`,
      );
      return [];
    }

    return parsed.data.data;
  } catch (error) {
    console.error('[fetchSimilarJobs] Fetch failed:', error);
    return [];
  }
};
