import 'server-only';

import { cache } from 'react';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';
import { getApiSlug } from '@/features/pillar/constants';
import {
  jobMarketOverviewSchema,
  jobMarketSkillDetailSchema,
  jobMarketSkillListSchema,
  jobMarketStateSchema,
  pillarMarketSchema,
  type JobMarketOverview,
  type JobMarketSkillDetail,
  type JobMarketSkillList,
  type JobMarketState,
  type PillarMarket,
} from '../schemas';

const responseSchema = <T extends z.ZodType>(data: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: data.nullish(),
  });

const fetchMarket = async <T>(
  path: string,
  schema: z.ZodType<T>,
): Promise<T | null> => {
  try {
    const response = await fetch(`${clientEnv.MW_URL}${path}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const parsed = responseSchema(schema).safeParse(await response.json());
    if (!parsed.success || !parsed.data.success || !parsed.data.data) {
      return null;
    }
    return parsed.data.data;
  } catch {
    // Market intelligence is deliberately optional: a telemetry outage must
    // never take down the home page or a pillar's jobs.
    return null;
  }
};

const fetchJobMarketOverviewUncached = () =>
  fetchMarket<JobMarketOverview>(
    '/v2/search/market/overview',
    jobMarketOverviewSchema,
  );

const fetchPillarMarketUncached = (
  slug: string,
  range: '90' | '365' | 'max' = '365',
) =>
  fetchMarket<PillarMarket>(
    `/v2/search/market/pillars/${encodeURIComponent(getApiSlug(slug))}?range=${range}`,
    pillarMarketSchema,
  );

const fetchJobMarketStateUncached = (
  range: '90' | '365' | 'max' = 'max',
  classification = 'market',
) => {
  const params = new URLSearchParams({ range, classification });
  return fetchMarket<JobMarketState>(
    `/v2/search/market/state?${params.toString()}`,
    jobMarketStateSchema,
  );
};

const fetchJobMarketSkillsUncached = (
  mode: 'remote' | 'local' = 'remote',
  sort: 'breakout' | 'repricing' | 'salary' | 'demand' | 'cooling' = 'breakout',
  query = '',
  classification = 'market',
) => {
  const params = new URLSearchParams({ mode, sort, classification });
  if (query.trim()) params.set('q', query.trim());
  return fetchMarket<JobMarketSkillList>(
    `/v2/search/market/skills?${params.toString()}`,
    jobMarketSkillListSchema,
  );
};

const fetchJobMarketSkillDetailUncached = (
  slug: string,
  range: '90' | '365' | 'max' = 'max',
) =>
  fetchMarket<JobMarketSkillDetail>(
    `/v2/search/market/skills/${encodeURIComponent(getApiSlug(slug))}?range=${range}`,
    jobMarketSkillDetailSchema,
  );

// React cache deduplicates calls within a render without persisting a null
// response across requests. The middleware owns the one-hour HTTP cache for
// successful data; a temporary "not ready" response must recover immediately.
export const fetchJobMarketOverview = cache(fetchJobMarketOverviewUncached);
export const fetchPillarMarket = cache(fetchPillarMarketUncached);
export const fetchJobMarketState = cache(fetchJobMarketStateUncached);
export const fetchJobMarketSkills = cache(fetchJobMarketSkillsUncached);
export const fetchJobMarketSkillDetail = cache(
  fetchJobMarketSkillDetailUncached,
);
