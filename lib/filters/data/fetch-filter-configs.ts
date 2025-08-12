'use server';

import { MwSchemaError } from '@/lib/shared/core/errors';
import { FILTER_ENDPOINTS } from '@/lib/filters/core/constants';
import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { filterConfigDto } from '@/lib/filters/server/dtos';
import { dtoToFilterConfig } from '@/lib/filters/server/dtos/dto-to-filter-config';

export const fetchFilterConfigs = async (): Promise<FilterConfigSchema[]> => {
  const url = FILTER_ENDPOINTS.filterConfigs();
  const response = await kyFetch(url).json();
  const parsed = safeParse('filterConfigSchema', filterConfigDto, response);

  if (!parsed.success) {
    throw new MwSchemaError('fetchFilterConfigs', JSON.stringify(parsed.error.issues[0]));
  }

  return dtoToFilterConfig(parsed.data);
};
