'use client';

import { useState } from 'react';
import { FunnelIcon } from 'lucide-react';

import type { PillarFilterContext } from '@/features/pillar/schemas';
import type { FilterConfigSchema } from '@/features/filters/schemas';
import { useActiveFilters } from '@/features/filters/hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { FiltersAsideClient } from './filters-aside.client';

interface Props {
  configs: FilterConfigSchema[];
  pillarContext?: PillarFilterContext | null;
  pillarMode?: boolean;
}

export const FiltersDrawerClient = ({
  configs,
  pillarContext,
  pillarMode,
}: Props) => {
  const [open, setOpen] = useState(false);

  // Outside the pillar provider this counts URL-active filters (home). On
  // pillar pages the URL is empty, so count the pillar's implied criteria.
  const urlActiveCount = useActiveFilters(configs).length;
  const activeCount = pillarMode ? 1 + (pillarContext ? 1 : 0) : urlActiveCount;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='secondary' size='sm' className='gap-2'>
          <FunnelIcon className='size-3.5' />
          Filters
          {activeCount > 0 && (
            <Badge variant='default' className='px-1.5 text-[10px]'>
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='w-80 max-w-[85vw]'
        // Don't auto-focus the first chip — it pops its tooltip on open
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader className='border-b border-border/50'>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto px-4 pb-6'>
          <div className='flex flex-col gap-2 [&_button]:w-fit'>
            <FiltersAsideClient
              configs={configs}
              pillarContext={pillarContext}
              pillarMode={pillarMode}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
