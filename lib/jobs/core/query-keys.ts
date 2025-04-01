import { SHARED_QUERY_KEYS } from '@/lib/shared/core/query-keys';

export const JOBS_QUERY_KEYS = {
  all: [...SHARED_QUERY_KEYS.all, 'jobs'],
  list: (paramsQueryKey: string) => [...JOBS_QUERY_KEYS.all, 'list', paramsQueryKey],
} as const;
