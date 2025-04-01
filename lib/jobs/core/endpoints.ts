import 'server-only';

import { ENV } from '@/lib/shared/core/envs';

export const BASE_URL = `${ENV.MW_URL}/jobs` as const;

export const JOB_ENDPOINTS = {
  details: (id: string) => `${BASE_URL}/details/${id}` as const,
  list: ({
    page,
    limit,
    searchParams,
  }: {
    page: number;
    limit: number;
    searchParams?: Record<string, string>;
  }) => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        query.append(key, value);
      });
    }
    return `${BASE_URL}/list?${query.toString()}` as const;
  },
};
