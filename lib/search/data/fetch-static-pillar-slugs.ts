import 'server-only';

import { CLIENT_ENVS } from '@/lib/shared/core/client.env';
import { MwSchemaError } from '@/lib/shared/core/errors';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { pillarSlugsDto } from '@/lib/search/server/dtos';
import { dtoToStaticPillarSlugs } from '@/lib/search/server/dtos/dto-to-static-pillar-slugs';

const LIMIT_LENGTH = 255;

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
    slug: slug.length > LIMIT_LENGTH ? sanitizeSlug(slug) : slug,
  }));
};

const sanitizeSlug = (slug: string): string => {
  const truncated = slug.slice(0, LIMIT_LENGTH);
  const lastSeparatorIndex = truncated.lastIndexOf('-');
  if (lastSeparatorIndex === -1) return truncated;
  const sanitized = truncated.slice(0, lastSeparatorIndex);
  return sanitized || truncated;
};
