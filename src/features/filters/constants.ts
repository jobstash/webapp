import { clientEnv } from '@/lib/env/client';

export const FILTER_KIND = {
  SORT: 'SORT',
  SWITCH: 'SWITCH',
  RADIO: 'RADIO',
  CHECKBOX: 'CHECKBOX',
  SEARCH: 'SEARCH',
  REMOTE_SEARCH: 'REMOTE_SEARCH',
  RANGE: 'RANGE',
} as const;
export type FilterKind = (typeof FILTER_KIND)[keyof typeof FILTER_KIND];

export const REMOTE_FILTERS = {
  tags: `${clientEnv.MW_URL}/tags/search`,
};

export const REMOTE_FILTERS_SET = new Set(Object.keys(REMOTE_FILTERS));

export const FILTER_POPOVER_CONTENT_CLASS =
  'relative flex w-fit max-w-60 min-w-32 flex-col gap-2 border-neutral-800 p-0';

export const FILTER_DROPDOWN_CONTENT_CLASS = 'w-fit max-w-60 min-w-32';
