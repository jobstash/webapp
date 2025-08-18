'use server';

import { CLIENT_ENVS } from '@/lib/shared/core/client.env';
import { MwSchemaError } from '@/lib/shared/core/errors';
import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { filterConfigDto } from '@/lib/filters/server/dtos';
import { dtoToFilterConfig } from '@/lib/filters/server/dtos/dto-to-filter-config';

export const fetchFilterConfigs = async (): Promise<FilterConfigSchema[]> => {
  const url = `${CLIENT_ENVS.MW_URL}/jobs/filters`;
  const response = await kyFetch(url).json();
  const parsed = safeParse('filterConfigSchema', filterConfigDto, response);

  if (!parsed.success) {
    throw new MwSchemaError('fetchFilterConfigs', JSON.stringify(parsed.error.issues[0]));
  }

  return dtoToFilterConfig(parsed.data);
};
