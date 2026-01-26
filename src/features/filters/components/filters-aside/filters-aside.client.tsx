'use client';

import type { PillarFilterContext } from '@/features/pillar/schemas';
import type { FilterConfigSchema } from '@/features/filters/schemas';
import { useFilterConfigsWithPillarContext } from '@/features/filters/hooks';
import { ActiveFilters } from '@/features/filters/components/active-filters';
import { SuggestedFilters } from '@/features/filters/components/suggested-filters';
import { MoreFilters } from '@/features/filters/components/more-filters';

interface Props {
  configs: FilterConfigSchema[];
  pillarContext?: PillarFilterContext | null;
}

export const FiltersAsideClient = ({ configs, pillarContext }: Props) => {
  const filteredConfigs = useFilterConfigsWithPillarContext(
    configs,
    pillarContext,
  );

  return (
    <>
      <ActiveFilters configs={filteredConfigs} pillarContext={pillarContext} />
      <SuggestedFilters
        configs={filteredConfigs}
        pillarContext={pillarContext}
      />
      <MoreFilters configs={filteredConfigs} />
    </>
  );
};
