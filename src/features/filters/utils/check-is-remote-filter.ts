import { REMOTE_FILTERS_SET } from '@/features/filters/constants';

export const checkIsRemoteFilter = (paramKey: string) =>
  REMOTE_FILTERS_SET.has(paramKey);
