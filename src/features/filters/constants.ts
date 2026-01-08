import { clientEnv } from '@/lib/env/client';

export const FILTER_KIND = {
  SORT: 'SORT',
  SWITCH: 'SWITCH',
  RADIO: 'RADIO',
  CHECKBOX: 'CHECKBOX',
  SEARCH: 'SEARCH',
  REMOTE_SEARCH: 'REMOTE_SEARCH',

  // TODO: RANGE: 'RANGE',
} as const;
export type FilterKind = (typeof FILTER_KIND)[keyof typeof FILTER_KIND];

export const REMOTE_FILTERS = {
  tags: `${clientEnv.MW_URL}/tags/search`,
};

export const REMOTE_FILTERS_SET = new Set(Object.keys(REMOTE_FILTERS));
