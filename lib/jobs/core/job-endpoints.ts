import 'server-only';

import { envs } from '@/lib/shared/core/envs';

const BASE_URL = `${envs.MW_URL}/jobs`;

export const JOB_BASE_URLS = {
  LIST: `${BASE_URL}/list`,
};

export const jobEndpoints = {
  list: ({ page, limit }: { page: number; limit: number }) => {
    return `${JOB_BASE_URLS.LIST}?page=${page}&limit=${limit}`;
  },
};
