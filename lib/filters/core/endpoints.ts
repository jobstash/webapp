import { ENV } from '@/lib/shared/core/envs';

export const FILTER_ENDPOINTS = {
  filterConfigs: () => `${ENV.MW_URL}/jobs/filters` as const,
};
