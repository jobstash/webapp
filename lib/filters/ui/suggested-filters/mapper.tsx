'use client';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

import { SelectPopoverContent } from './select-popover-content';

interface Props {
  config: FilterConfigItemSchema;
}

export const SuggestedFiltersContentMapper = ({ config }: Props) => {
  switch (config.kind) {
    case FILTER_KIND.SINGLE_SELECT:
    case FILTER_KIND.MULTI_SELECT:
    case FILTER_KIND.RADIO:
    case FILTER_KIND.CHECKBOX:
      return <SelectPopoverContent config={config} />;
    default:
      return null;
  }
};
