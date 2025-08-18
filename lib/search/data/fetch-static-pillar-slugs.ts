import 'server-only';

import { CLIENT_ENVS } from '@/lib/shared/core/client.env';
import { MwSchemaError } from '@/lib/shared/core/errors';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { pillarSlugsDto } from '@/lib/search/server/dtos';
import { dtoToStaticPillarSlugs } from '@/lib/search/server/dtos/dto-to-static-pillar-slugs';

export const fetchStaticPillarSlugs = async () => {
  const url = `${CLIENT_ENVS.MW_URL}/search/pillar/slugs?nav=jobs`;
  const response = await kyFetch(url).json();

  const parsed = safeParse('pillarSlugsDto', pillarSlugsDto, response);
  if (!parsed.success) {
    throw new MwSchemaError(
      'fetchStaticPillarSlugs',
      JSON.stringify(parsed.error.issues[0]),
    );
  }

  return dtoToStaticPillarSlugs(parsed.data).map((slug) => ({
    slug,
  }));
};
