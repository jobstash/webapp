'use client';

import React, { forwardRef } from 'react';

import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';
import { useFilterStore } from '@/lib/filters/core/store';

import { cn } from '@/lib/shared/utils';
import { getFilterItemIcon } from '@/lib/filters/utils/get-filter-item-icon';

import { Button } from '@/lib/shared/ui/base/button';
import { useFilterItemPopoverContext } from '@/lib/filters/ui/filter-item-popover';

interface Props {
  config: FilterConfigItemSchema;
  isPopover: boolean;
}

export const SuggestedFiltersTrigger = forwardRef<HTMLButtonElement, Props>(
  ({ config, isPopover }, ref) => {
    const { toggleOpen, isPending } = useFilterItemPopoverContext();
    const { icon } = getFilterItemIcon(config);

    const addActiveFilter = useFilterStore((state) => state.addActiveFilter);
    const onClick = isPopover ? toggleOpen : () => addActiveFilter(config);

    return (
      <Button
        size='xs'
        className={cn(
          'h-7 items-center gap-1.5 border border-dashed bg-sidebar text-muted-foreground/80 hover:bg-muted',
          { 'pointer-events-none opacity-60': isPending },
        )}
        disabled={isPending}
        onClick={onClick}
        {...(ref ? { ref } : {})}
      >
        {icon}
        {config.label}
      </Button>
    );
  },
);

SuggestedFiltersTrigger.displayName = 'SuggestedFiltersTrigger';
