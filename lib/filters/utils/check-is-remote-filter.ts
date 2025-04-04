import { REMOTE_FILTERS_SET } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

import { getFilterParamKey } from './get-filter-param-key';

export const checkIsRemoteFilter = (config: FilterConfigItemSchema) =>
  REMOTE_FILTERS_SET.has(getFilterParamKey(config));
