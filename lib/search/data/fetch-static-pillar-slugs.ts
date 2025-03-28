import { MwSchemaError } from '@/lib/shared/core/errors';
import { SEARCH_ENDPOINTS } from '@/lib/search/core/endpoints';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { pillarSlugsDto } from '@/lib/search/server/dtos';
import { dtoToStaticPillarSlugs } from '@/lib/search/server/dtos/dto-to-static-pillar-slugs';

export const fetchStaticPillarSlugs = async () => {
  const url = SEARCH_ENDPOINTS.staticPillarSlugs();
  const response = await kyFetch(url).json();

  const parsed = safeParse('pillarSlugsDto', pillarSlugsDto, response);
  if (!parsed.success) {
    throw new MwSchemaError('fetchStaticPillarSlugs', JSON.stringify(parsed.issues[0]));
  }

  return dtoToStaticPillarSlugs(parsed.output);
};
