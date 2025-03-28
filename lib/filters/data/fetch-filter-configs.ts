import { MwSchemaError } from '@/lib/shared/core/errors';
import { filterConfigSchema } from '@/lib/filters/core/dtos';
import { FILTER_ENDPOINTS } from '@/lib/filters/core/endpoints';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const fetchFilterConfigs = async () => {
  const response = await kyFetch(FILTER_ENDPOINTS.filterConfigs()).json();
  const parsed = safeParse('filterConfigSchema', filterConfigSchema, response);

  if (!parsed.success) {
    throw new MwSchemaError('fetchFilterConfigs', JSON.stringify(parsed.issues[0]));
  }

  return parsed.output;
};
