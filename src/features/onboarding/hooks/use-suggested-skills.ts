'use client';

import { useQuery } from '@tanstack/react-query';

import { clientEnv } from '@/lib/env/client';
import { getTagColorIndex } from '@/lib/utils';
import {
  popularTagsResponseSchema,
  type UserSkill,
} from '@/features/onboarding/schemas';

const LIMIT = 10;

const fetchSuggestedSkills = async (): Promise<UserSkill[]> => {
  const url = new URL('/search/tags/suggestions', clientEnv.MW_URL);
  url.searchParams.set('q', '');
  url.searchParams.set('page', '1');
  url.searchParams.set('limit', String(LIMIT));

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Suggested skills fetch failed: ${res.status}`);

  const json: unknown = await res.json();
  const data = popularTagsResponseSchema.parse(json).data;

  return data.items.map((tag) => ({
    id: tag.id,
    name: tag.name,
    colorIndex: getTagColorIndex(tag.id),
    isFromResume: false,
  }));
};

export const useSuggestedSkills = (selectedIds: Set<string>) => {
  const { data, isPending } = useQuery({
    queryKey: ['onboarding-suggested-skills'],
    queryFn: fetchSuggestedSkills,
    staleTime: Infinity,
  });

  const suggestedSkills =
    data?.filter((skill) => !selectedIds.has(skill.id)) ?? [];

  return { suggestedSkills, isLoading: isPending };
};
