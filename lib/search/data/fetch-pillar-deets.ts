'use server';

import { ENV } from '@/lib/shared/core/envs';
import { MwSchemaError } from '@/lib/shared/core/errors';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { pillarDeetsDto } from '@/lib/search/server/dtos';
import { dtoToPillarDeets } from '@/lib/search/server/dtos/dto-to-pillar-deets';

export const fetchPillarDeets = async (slug: string) => {
  const url = `${ENV.MW_URL}/search/pillar/details?nav=jobs&slug=${slug}`;
  const response = await kyFetch(url, { cache: 'force-cache' }).json();

  const parsed = safeParse('pillarDeetsDto', pillarDeetsDto, response);
  if (!parsed.success) {
    throw new MwSchemaError('fetchPillarDeets', JSON.stringify(parsed.error.issues[0]));
  }

  return dtoToPillarDeets(parsed.data);
};
