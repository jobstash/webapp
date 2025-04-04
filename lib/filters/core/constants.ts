import { ENV } from '@/lib/shared/core/envs';

export const FILTER_KIND = {
  RANGE: 'RANGE',
  SINGLE_SELECT: 'SINGLE_SELECT',
  MULTI_SELECT: 'MULTI_SELECT',
  MULTI_SELECT_WITH_SEARCH: 'MULTI_SELECT_WITH_SEARCH',
  RADIO: 'RADIO',
  CHECKBOX: 'CHECKBOX',
  SWITCH: 'SWITCH',
} as const;

export const REMOTE_FILTERS = {
  tags: `${ENV.MW_URL}/tags/search`,
};
export const REMOTE_FILTERS_SET = new Set(Object.keys(REMOTE_FILTERS));
