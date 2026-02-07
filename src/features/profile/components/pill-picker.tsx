'use client';

import type { ComponentType } from 'react';

import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface PillPickerItem {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

interface PillPickerProps {
  items: PillPickerItem[];
  selectedKeys: Set<string>;
  onToggle: (key: string) => void;
}

export const PillPicker = ({
  items,
  selectedKeys,
  onToggle,
}: PillPickerProps) => (
  <div className='flex flex-wrap gap-2'>
    {items.map((item) => {
      const isSelected = selectedKeys.has(item.key);
      const Icon = item.icon;
      return (
        <button
          key={item.key}
          type='button'
          onClick={() => onToggle(item.key)}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200',
            isSelected
              ? 'border-primary/30 bg-accent text-foreground ring-1 ring-primary/20'
              : 'border-neutral-700/50 bg-neutral-800/50 text-neutral-400 hover:border-neutral-600 hover:bg-neutral-800',
          )}
        >
          <Icon className='size-3.5' />
          {item.label}
          {isSelected && <CheckIcon className='size-3' />}
        </button>
      );
    })}
  </div>
);
