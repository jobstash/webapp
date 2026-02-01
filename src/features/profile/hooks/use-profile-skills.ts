'use client';

import { useQuery } from '@tanstack/react-query';

const fetchProfileSkills = async (): Promise<unknown> => {
  const res = await fetch('/api/profile/skills');
  if (!res.ok) throw new Error(`GET /api/profile/skills failed: ${res.status}`);
  return res.json() as Promise<unknown>;
};

export const useProfileSkills = (enabled: boolean) =>
  useQuery({
    queryKey: ['profile-skills'],
    queryFn: fetchProfileSkills,
    enabled,
  });
