import 'server-only';

import { ENV } from '@/lib/shared/core/envs';

export const BASE_URL = `${ENV.MW_URL}/jobs` as const;

export const JOB_ENDPOINTS = {
  details: (id: string) => `${BASE_URL}/details/${id}` as const,
  list: ({ page, limit }: { page: number; limit: number }) => {
    return `${BASE_URL}/list?page=${page}&limit=${limit}` as const;
  },
};
