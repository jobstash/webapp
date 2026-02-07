'use client';

import { useQuery } from '@tanstack/react-query';

import {
  type LinkedAccount,
  linkedAccountsResponseSchema,
} from '@/features/profile/schemas';

export const LINKED_ACCOUNTS_QUERY_KEY = ['linked-accounts'];

const fetchLinkedAccounts = async (): Promise<LinkedAccount[]> => {
  const res = await fetch('/api/profile/linked-accounts');

  // 401 = session missing privyDid (pre-migration login). Return empty until next login.
  if (res.status === 401) return [];

  if (!res.ok)
    throw new Error(`GET /api/profile/linked-accounts failed: ${res.status}`);

  const json: unknown = await res.json();
  const parsed = linkedAccountsResponseSchema.parse(json);
  return parsed.data;
};

export const useLinkedAccounts = () =>
  useQuery({
    queryKey: LINKED_ACCOUNTS_QUERY_KEY,
    queryFn: fetchLinkedAccounts,
    staleTime: 5 * 60 * 1000,
  });
