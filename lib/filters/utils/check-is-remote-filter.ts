import { REMOTE_FILTERS_SET } from '@/lib/filters/core/constants';
import { FilterConfigSchema } from '@/lib/filters/core/schemas';

export const checkIsRemoteFilter = (config: FilterConfigSchema) =>
  REMOTE_FILTERS_SET.has(config.paramKey);
