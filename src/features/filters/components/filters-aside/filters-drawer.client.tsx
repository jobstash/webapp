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
  SheetClose,
  SheetDescription,
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
  const activeCount = pillarMode
    ? (pillarContext?.paramKey === 'organizations' ? 0 : 1) +
      (pillarContext ? 1 : 0)
    : urlActiveCount;

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
        className='h-dvh w-full max-w-sm gap-0'
        // Don't auto-focus the first chip — it pops its tooltip on open
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader className='border-b border-border/50'>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription className='sr-only'>
            Refine the jobs shown in the results list.
          </SheetDescription>
        </SheetHeader>
        <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain p-4'>
          <div className='flex flex-col gap-4'>
            <FiltersAsideClient
              configs={configs}
              pillarContext={pillarContext}
              pillarMode={pillarMode}
            />
          </div>
        </div>
        <div className='shrink-0 border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
          <SheetClose asChild>
            <Button className='min-h-11 w-full'>Show results</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};
