'use client';

import type { PillarFilterContext } from '@/features/pillar/schemas';
import type { FilterConfigSchema } from '@/features/filters/schemas';
import {
  PillarFilterModeProvider,
  useFilterConfigsWithPillarContext,
} from '@/features/filters/hooks';
import { ActiveFilters } from '@/features/filters/components/active-filters';
import { SuggestedFilters } from '@/features/filters/components/suggested-filters';
import { SortFilters } from '@/features/filters/components/sort-filters';
import { FilterOverlayProvider } from '@/features/filters/components/filter-overlay';

interface Props {
  configs: FilterConfigSchema[];
  pillarContext?: PillarFilterContext | null;
  pillarMode?: boolean;
}

export const FiltersAsideClient = ({
  configs,
  pillarContext,
  pillarMode,
}: Props) => {
  // In pillar mode the pillar's own value must STAY in the options: the mock
  // chip resolves its label from them, and unchecking it is a valid way out.
  const filteredConfigs = useFilterConfigsWithPillarContext(
    configs,
    pillarMode ? null : pillarContext,
  );

  const body = (
    <FilterOverlayProvider>
      <ActiveFilters
        configs={filteredConfigs}
        pillarContext={pillarMode ? null : pillarContext}
      />
      <SuggestedFilters
        configs={filteredConfigs}
        pillarContext={pillarMode ? null : pillarContext}
      />
      <SortFilters configs={filteredConfigs} />
    </FilterOverlayProvider>
  );

  if (!pillarMode) return body;

  return (
    <PillarFilterModeProvider pillarContext={pillarContext ?? null}>
      {body}
    </PillarFilterModeProvider>
  );
};
