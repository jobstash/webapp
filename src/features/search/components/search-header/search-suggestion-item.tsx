'use client';

import Link from 'next/link';

import { CommandItem } from '@/components/ui/command';

import type { SuggestionItem } from '@/features/search/schemas';

interface Props {
  item: SuggestionItem;
  onSelect: () => void;
}

export const SearchSuggestionItem = ({ item, onSelect }: Props) => (
  <CommandItem value={item.label} asChild onSelect={onSelect}>
    <Link href={item.href}>{item.label}</Link>
  </CommandItem>
);
