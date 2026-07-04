'use client';

import { useQueryState } from 'nuqs';
import { useProgress } from '@bprogress/next';

import { GA_EVENT, trackEvent } from '@/lib/analytics';

import { usePillarFilterMode } from './use-pillar-filter-mode';

export interface FilterAnalyticsContext {
  filterType?: string;
  analyticsId?: string | null;
  analyticsName?: string | null;
}

export const useFilterQueryState = (
  paramKey: string,
  analytics?: FilterAnalyticsContext,
) => {
  const { start } = useProgress();
  const pillarMode = usePillarFilterMode();
  const [filterParam, setFilterParam] = useQueryState(paramKey);
  const [, setPage] = useQueryState('page');

  const setFilterWithPageReset = (value: string | null) => {
    start();

    if (value !== null) {
      trackEvent(GA_EVENT.FILTER_APPLIED, {
        filter_name: paramKey,
        filter_value: value,
        filter_type: analytics?.filterType ?? 'unknown',
        ...(analytics?.analyticsId && { analytics_id: analytics.analyticsId }),
        ...(analytics?.analyticsName && {
          analytics_name: analytics.analyticsName,
        }),
      });
    } else {
      trackEvent(GA_EVENT.FILTER_REMOVED, { filter_name: paramKey });
    }

    // On pillar pages the job list is static — a nuqs write would change the
    // URL without refetching. Navigate to the home page in real filter mode
    // instead, carrying the pillar criteria plus this change.
    if (pillarMode) {
      pillarMode.navigate({ [paramKey]: value });
      return;
    }

    setPage(null);
    return setFilterParam(value);
  };

  const effectiveValue = pillarMode
    ? (pillarMode.baseParams[paramKey] ?? null)
    : filterParam;

  return [effectiveValue, setFilterWithPageReset] as const;
};
