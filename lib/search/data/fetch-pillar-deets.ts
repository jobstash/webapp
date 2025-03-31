'use server';

import { MwSchemaError } from '@/lib/shared/core/errors';
import { SEARCH_ENDPOINTS } from '@/lib/search/core/endpoints';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { pillarDeetsDto } from '@/lib/search/server/dtos';
import { dtoToPillarDeets } from '@/lib/search/server/dtos/dto-to-pillar-deets';

export const fetchPillarDeets = async (slug: string) => {
  const url = SEARCH_ENDPOINTS.pillarDeets(slug);
  const response = await kyFetch(url, { cache: 'force-cache' }).json();

  const parsed = safeParse('pillarDeetsDto', pillarDeetsDto, response);
  if (!parsed.success) {
    throw new MwSchemaError('fetchPillarDeets', JSON.stringify(parsed.issues[0]));
  }

  return dtoToPillarDeets(parsed.output);
};
