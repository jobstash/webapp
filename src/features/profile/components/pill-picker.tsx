'use client';

import type { ComponentType } from 'react';

import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface PillPickerItem {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  disabled?: boolean;
  tooltip?: string;
  isConnected?: boolean;
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

      if (item.disabled) {
        const pill = (
          <span
            className={cn(
              'inline-flex cursor-default items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium opacity-50',
              item.isConnected
                ? 'border-primary/30 bg-accent text-foreground ring-1 ring-primary/20'
                : 'border-neutral-700/50 bg-neutral-800/50 text-neutral-400',
            )}
          >
            <Icon className='size-3.5' />
            {item.label}
            {item.isConnected && <CheckIcon className='size-3' />}
          </span>
        );

        if (!item.tooltip) return <span key={item.key}>{pill}</span>;

        return (
          <Tooltip key={item.key}>
            <TooltipTrigger asChild>{pill}</TooltipTrigger>
            <TooltipContent>{item.tooltip}</TooltipContent>
          </Tooltip>
        );
      }

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
