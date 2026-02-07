'use client';

import { useQuery } from '@tanstack/react-query';

import {
  type ShowcaseItem,
  profileShowcaseResponseSchema,
} from '@/features/profile/schemas';

const fetchProfileShowcase = async (): Promise<ShowcaseItem[]> => {
  const res = await fetch('/api/profile/showcase');
  if (!res.ok)
    throw new Error(`GET /api/profile/showcase failed: ${res.status}`);

  const json: unknown = await res.json();
  const parsed = profileShowcaseResponseSchema.parse(json);
  return parsed.data;
};

export const useProfileShowcase = (enabled: boolean) =>
  useQuery({
    queryKey: ['profile-showcase'],
    queryFn: fetchProfileShowcase,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
