import { queryOptions } from '@tanstack/react-query';

import { SHARED_QUERIES } from '@/lib/shared/core/query-keys';

import { getUserCredentials } from '@/lib/auth/data';
import { getUser } from '@/lib/auth/data/get-user';

export const AUTH_QUERIES = {
  all: [...SHARED_QUERIES.all, 'auth'],
  getUser: () =>
    queryOptions({
      queryKey: [...AUTH_QUERIES.all, 'getUser'],
      queryFn: getUser,
    }),
  getUserCredentials: (privyToken: string) =>
    queryOptions({
      queryKey: [...AUTH_QUERIES.all, 'getUserCredentials', privyToken],
      queryFn: () => getUserCredentials(privyToken),
    }),
} as const;
