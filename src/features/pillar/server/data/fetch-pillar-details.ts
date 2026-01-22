import 'server-only';

import { clientEnv } from '@/lib/env/client';
import type { PillarDetails } from '@/features/pillar/schemas';
import {
  pillarDetailsDto,
  dtoToPillarDetails,
} from '@/features/pillar/server/dtos';

interface FetchPillarDetailsParams {
  slug: string;
}

export const fetchPillarDetails = async ({
  slug,
}: FetchPillarDetailsParams): Promise<PillarDetails | null> => {
  const url = `${clientEnv.MW_URL}/search/pillar/details?nav=jobs&slug=${slug}`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const json = await response.json();
  const parsed = pillarDetailsDto.safeParse(json);
  if (!parsed.success) return null;

  return dtoToPillarDetails(parsed.data);
};
