'use client';

import { useQuery } from '@tanstack/react-query';

import type { ProfileSkill } from '@/features/profile/schemas';

const fetchProfileSkills = async (): Promise<ProfileSkill[]> => {
  const res = await fetch('/api/profile/skills');
  if (!res.ok) throw new Error(`GET /api/profile/skills failed: ${res.status}`);

  const json = (await res.json()) as { data: ProfileSkill[] };
  return json.data;
};

export const useProfileSkills = (enabled: boolean) =>
  useQuery({
    queryKey: ['profile-skills'],
    queryFn: fetchProfileSkills,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
