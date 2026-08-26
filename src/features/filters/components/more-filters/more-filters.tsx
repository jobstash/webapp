'use client';

import { useCallback, useState, useTransition } from 'react';
import { ListFilterPlusIcon, LoaderIcon } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import { FILTER_KIND } from '@/features/filters/constants';
import { groupFilterConfigs } from '@/features/filters/filter-groups';
import { type FilterConfigSchema } from '@/features/filters/schemas';

import { MoreFiltersItem } from './more-filters-item';
import { MoreFiltersRangeItem } from './more-filters-range-item';
import { useMoreFiltersOptions } from './use-more-filters-options';

interface Props {
  configs: FilterConfigSchema[];
}

export const MoreFilters = ({ configs }: Props) => {
  const options = useMoreFiltersOptions(configs);
  const groups = groupFilterConfigs(options);
  const [open, setOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    const sheet =
      node?.closest<HTMLElement>('[data-slot="sheet-content"]') ?? null;
    setPortalContainer((current) => (current === sheet ? current : sheet));
  }, []);
  const closeDropdown = () => setOpen(false);
  const [isPending, startTransition] = useTransition();
  return (
    <div ref={setContainerRef} className='w-full'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger disabled={isPending} asChild>
          <Button
            size='xs'
            variant='secondary'
            className='flex h-8 w-full items-center justify-start gap-1.5 bg-sidebar text-muted-foreground/80 hover:bg-muted'
            disabled={isPending}
          >
            <div className='grid size-4 place-items-center'>
              {isPending ? (
                <LoaderIcon className='shrink-0 animate-spin text-neutral-400' />
              ) : (
                <ListFilterPlusIcon className='size-4' />
              )}
            </div>
            <span className='flex-1 text-left'>More filters</span>
            <span className='text-[10px] text-muted-foreground/60 tabular-nums'>
              {options.length}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side='bottom'
          align='start'
          collisionPadding={16}
          portalContainer={portalContainer}
          className='relative flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2 border-neutral-800 p-0'
        >
          <Command>
            <CommandInput placeholder='Search filters...' />
            <CommandList className='max-h-[min(60dvh,32rem)] touch-pan-y overscroll-contain [-webkit-overflow-scrolling:touch]'>
              <CommandEmpty>No results found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.id} heading={group.label}>
                  {group.configs.map((config) => {
                    if (config.kind === FILTER_KIND.RANGE) {
                      return (
                        <MoreFiltersRangeItem
                          key={config.label}
                          isPending={isPending}
                          config={config}
                          closeDropdown={closeDropdown}
                          startTransition={startTransition}
                        />
                      );
                    }

                    return (
                      <MoreFiltersItem
                        key={config.label}
                        isPending={isPending}
                        paramKey={config.paramKey}
                        label={config.label}
                        defaultValue={getDefaultValue(config)}
                        closeDropdown={closeDropdown}
                        startTransition={startTransition}
                      />
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const getDefaultValue = (config: FilterConfigSchema): string | null => {
  switch (config.kind) {
    case FILTER_KIND.SWITCH:
      return 'true';
    case FILTER_KIND.RADIO:
    case FILTER_KIND.CHECKBOX:
    case FILTER_KIND.SEARCH:
    case FILTER_KIND.REMOTE_SEARCH:
      return config.options[0].value;
    default:
      return null;
  }
};
