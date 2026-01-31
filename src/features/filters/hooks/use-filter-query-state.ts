'use client';

import { useQueryState } from 'nuqs';
import { useProgress } from '@bprogress/next';

import { GA_EVENT, trackEvent } from '@/lib/analytics';

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
  const [filterParam, setFilterParam] = useQueryState(paramKey);
  const [, setPage] = useQueryState('page');

  const setFilterWithPageReset = (value: string | null) => {
    start();
    setPage(null);

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

    return setFilterParam(value);
  };

  return [filterParam, setFilterWithPageReset] as const;
};
