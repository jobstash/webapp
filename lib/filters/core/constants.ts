import { ENV } from '@/lib/shared/core/envs';

export const FILTER_KIND = {
  RANGE: 'RANGE',
  SINGLE_SELECT: 'SINGLE_SELECT',
  MULTI_SELECT: 'MULTI_SELECT',
  RADIO: 'RADIO',
  CHECKBOX: 'CHECKBOX',
  SWITCH: 'SWITCH',
} as const;
export type FilterKind = (typeof FILTER_KIND)[keyof typeof FILTER_KIND];

export const REMOTE_FILTERS = {
  tags: `${ENV.MW_URL}/tags/search`,
};

export const REMOTE_FILTERS_SET = new Set(Object.keys(REMOTE_FILTERS));

export const FILTER_ENDPOINTS = {
  filterConfigs: () => `${ENV.MW_URL}/jobs/filters` as const,
};
