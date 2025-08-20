'use server';

import { CLIENT_ENVS } from '@/lib/shared/core/client.env';
import { MwSchemaError } from '@/lib/shared/core/errors';

import { safeParse } from '@/lib/shared/utils/safe-parse';
import { titleCase } from '@/lib/shared/utils/title-case';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { pillarDeetsDto } from '@/lib/search/server/dtos';
import { dtoToPillarDeets } from '@/lib/search/server/dtos/dto-to-pillar-deets';

export const fetchPillarDeets = async (slug: string) => {
  try {
    const url = `${CLIENT_ENVS.MW_URL}/search/pillar/details?nav=jobs&slug=${slug}`;
    const response = await kyFetch(url, {
      cache: 'force-cache',
      throwHttpErrors: false,
    });
    const jsonData = await response.json();

    const parsed = safeParse('pillarDeetsDto', pillarDeetsDto, jsonData);
    if (!parsed.success) {
      throw new MwSchemaError('fetchPillarDeets', JSON.stringify(parsed.error.issues[0]));
    }

    return dtoToPillarDeets(parsed.data);
  } catch {
    return {
      title: titleCase(slug),
      description: 'This page is currently being worked on',
    };
  }
};
