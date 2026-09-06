'use client';

import { useQuery } from '@tanstack/react-query';

import { getTagColorIndex } from '@/lib/utils';
import type { PopularTagItem, UserSkill } from '@/features/profile/schemas';
import { uniqueSkills } from '../unique-skills';

const LIMIT = 10;

interface TagSuggestionsResponse {
  items: PopularTagItem[];
  page: number;
  hasMore: boolean;
}

const fetchSuggestedSkills = async (): Promise<UserSkill[]> => {
  const url = new URL('/api/search/tags/suggestions', window.location.origin);
  url.searchParams.set('q', '');
  url.searchParams.set('page', '1');
  url.searchParams.set('limit', String(LIMIT));

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Suggested skills fetch failed: ${res.status}`);

  const data = (await res.json()) as TagSuggestionsResponse;

  return data.items.map((tag) => ({
    id: tag.id,
    name: tag.name,
    colorIndex: getTagColorIndex(tag.id),
    isFromResume: false,
  }));
};

export const useSuggestedSkills = (
  selectedSkills: { id: string; name: string }[],
) => {
  const { data, isPending } = useQuery({
    queryKey: ['suggested-skills'],
    queryFn: fetchSuggestedSkills,
    staleTime: Infinity,
  });

  const suggestedSkills = uniqueSkills(data ?? [], selectedSkills);

  return { suggestedSkills, isLoading: isPending };
};
