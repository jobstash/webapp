'use client';

import { type FilterConfigSchema } from '@/features/filters/schemas';
import { ActiveFilters } from '@/features/filters/components/active-filters';
import { SuggestedFilters } from '@/features/filters/components/suggested-filters';
import { MoreFilters } from '@/features/filters/components/more-filters';

interface Props {
  configs: FilterConfigSchema[];
}

export const FiltersAsideClient = ({ configs }: Props) => {
  return (
    <>
      <ActiveFilters configs={configs} />
      <SuggestedFilters configs={configs} />
      <MoreFilters configs={configs} />
    </>
  );
};
