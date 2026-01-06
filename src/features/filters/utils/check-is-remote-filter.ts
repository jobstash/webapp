import { REMOTE_FILTERS_SET } from '@/features/filters/constants';
import { type FilterConfigSchema } from '@/features/filters/schemas';

export const checkIsRemoteFilter = (config: FilterConfigSchema) =>
  REMOTE_FILTERS_SET.has(config.paramKey);
