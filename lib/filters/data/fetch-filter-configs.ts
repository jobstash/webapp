'use server';

import { MwSchemaError } from '@/lib/shared/core/errors';
import { FILTER_ENDPOINTS } from '@/lib/filters/core/endpoints';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { filterConfigDto } from '@/lib/filters/server/dtos';
import { dtoToFilterConfig } from '@/lib/filters/server/dtos/dto-to-filter-configs';

export const fetchFilterConfigs = async () => {
  const response = await kyFetch(FILTER_ENDPOINTS.filterConfigs()).json();
  const parsed = safeParse('filterConfigSchema', filterConfigDto, response);

  if (!parsed.success) {
    throw new MwSchemaError('fetchFilterConfigs', JSON.stringify(parsed.issues[0]));
  }

  return dtoToFilterConfig(parsed.output);
};
