'use client';

import { useState } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import type {
  SuggestionGroup,
  SuggestionItem,
} from '@/features/search/schemas';

interface Props {
  groups: SuggestionGroup[];
  onItemSelect?: () => void;
}

const ResultItem = ({
  item,
  onSelect,
}: {
  item: SuggestionItem;
  onSelect?: () => void;
}) => (
  <Link
    href={item.href}
    onClick={onSelect}
    className='block rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:outline-none'
  >
    {item.label}
  </Link>
);

const TabButton = ({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type='button'
    onClick={onClick}
    className={cn(
      'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
      isActive
        ? 'bg-accent text-accent-foreground'
        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
    )}
  >
    {label}
    <span
      className={cn(
        'ml-1.5 text-xs',
        isActive ? 'text-accent-foreground/60' : 'text-muted-foreground/60',
      )}
    >
      {count}
    </span>
  </button>
);

export const SearchResultsTabs = ({ groups, onItemSelect }: Props) => {
  const nonEmptyGroups = groups.filter((group) => group.items.length > 0);
  const [activeTab, setActiveTab] = useState(nonEmptyGroups[0]?.label ?? '');

  if (nonEmptyGroups.length === 0) return null;

  const activeGroup = nonEmptyGroups.find((g) => g.label === activeTab);

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <div className='flex gap-1 border-b border-border px-2 py-2'>
        {nonEmptyGroups.map((group) => (
          <TabButton
            key={group.label}
            label={group.label}
            count={group.items.length}
            isActive={group.label === activeTab}
            onClick={() => setActiveTab(group.label)}
          />
        ))}
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto px-1 py-1'>
        {activeGroup?.items.map((item) => (
          <ResultItem key={item.id} item={item} onSelect={onItemSelect} />
        ))}
      </div>
    </div>
  );
};
