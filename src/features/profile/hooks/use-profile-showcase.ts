'use client';

import { useQuery } from '@tanstack/react-query';

const fetchProfileShowcase = async (): Promise<unknown> => {
  const res = await fetch('/api/profile/showcase');
  if (!res.ok)
    throw new Error(`GET /api/profile/showcase failed: ${res.status}`);
  return res.json() as Promise<unknown>;
};

export const useProfileShowcase = (enabled: boolean) =>
  useQuery({
    queryKey: ['profile-showcase'],
    queryFn: fetchProfileShowcase,
    enabled,
  });
