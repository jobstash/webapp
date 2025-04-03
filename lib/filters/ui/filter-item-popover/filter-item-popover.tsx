'use client';

import { ClassValue } from 'clsx';

import { cn } from '@/lib/shared/utils/cn';

import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shared/ui/base/popover';

import { FilterItemPopoverProvider, useFilterItemPopoverContext } from './context';

interface Props extends React.PropsWithChildren {
  trigger: React.ReactNode;
  classNames?: {
    trigger?: ClassValue;
    content?: ClassValue;
  };
}

const FilterItemPopoverInner = ({ trigger, children, classNames }: Props) => {
  const { open, toggleOpen } = useFilterItemPopoverContext();

  return (
    <Popover open={open} onOpenChange={toggleOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='start'
        className={cn(
          'relative flex w-fit max-w-60 min-w-32 flex-col gap-2 border-neutral-800 bg-muted p-0',
          classNames?.content,
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};

export const FilterItemPopover = ({ children, trigger, classNames }: Props) => {
  return (
    <FilterItemPopoverProvider>
      <FilterItemPopoverInner trigger={trigger} classNames={classNames}>
        {children}
      </FilterItemPopoverInner>
    </FilterItemPopoverProvider>
  );
};
