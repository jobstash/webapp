import { queryOptions } from '@tanstack/react-query';

import { SHARED_QUERIES } from '@/lib/shared/core/query-keys';

import { checkProfileEntry } from '@/lib/profile/data';

export const PROFILE_QUERIES = {
  all: [...SHARED_QUERIES.all, 'profile'],
  checkProfileEntry: () =>
    queryOptions({
      queryKey: [...PROFILE_QUERIES.all, 'checkProfileEntry'],
      queryFn: checkProfileEntry,
    }),
} as const;
