'use client';

import { createContext, useCallback, useContext, useState } from 'react';

import { Collapsible as CollapsiblePrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';
import {
  Popover as BasePopover,
  PopoverTrigger as BasePopoverTrigger,
  PopoverContent as BasePopoverContent,
} from '@/components/ui/popover';
import { DropdownMenuContent as BaseDropdownMenuContent } from '@/components/ui/dropdown-menu';

// Mobile filter options expand in the drawer's document flow. Unlike a
// positioned popover, a disclosure cannot flip above the trigger when the
// software keyboard changes the visible viewport.
export function Popover(props: React.ComponentProps<typeof BasePopover>) {
  const container = useContext(FilterOverlayContext);
  if (!container) return <BasePopover {...props} />;
  return (
    <CollapsiblePrimitive.Root
      open={props.open}
      defaultOpen={props.defaultOpen}
      onOpenChange={props.onOpenChange}
      className='contents'
    >
      {props.children}
    </CollapsiblePrimitive.Root>
  );
}

export function PopoverTrigger(
  props: React.ComponentProps<typeof BasePopoverTrigger>,
) {
  const container = useContext(FilterOverlayContext);
  return container ? (
    <CollapsiblePrimitive.Trigger {...props} />
  ) : (
    <BasePopoverTrigger {...props} />
  );
}
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const FilterOverlayContext = createContext<HTMLElement | null>(null);

// Keep option lists inside the drawer's focus and scrolling boundary.
export function FilterOverlayProvider({ children }: React.PropsWithChildren) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const setRef = useCallback((node: HTMLDivElement | null) => {
    setContainer(
      node?.closest<HTMLElement>('[data-slot="sheet-content"]') ?? null,
    );
  }, []);

  return (
    <FilterOverlayContext.Provider value={container}>
      <div ref={setRef} className='flex min-w-0 flex-col gap-4'>
        {children}
      </div>
    </FilterOverlayContext.Provider>
  );
}

export function PopoverContent({
  className,
  ...props
}: React.ComponentProps<typeof BasePopoverContent>) {
  const container = useContext(FilterOverlayContext);
  if (container) {
    return (
      <CollapsiblePrimitive.Content
        data-slot='filter-disclosure-content'
        className={cn(
          'rounded-md border bg-popover p-4 text-popover-foreground',
          className,
          'relative w-full min-w-0 basis-full overflow-hidden',
          '[&_[data-slot=command]]:h-auto [&_[data-slot=command]]:min-h-0',
          '[&_[data-slot=command-input]]:text-base',
          '[&_[data-slot=command-list]]:max-h-60 [&_[data-slot=command-list]]:touch-pan-y [&_[data-slot=command-list]]:overscroll-contain',
        )}
      >
        {props.children}
      </CollapsiblePrimitive.Content>
    );
  }
  return (
    <BasePopoverContent
      {...props}
      portalContainer={container}
      collisionPadding={12}
      sticky='always'
      className={cn(
        className,
        'max-h-(--radix-popover-content-available-height) max-w-[min(calc(100vw-1.5rem),var(--radix-popover-content-available-width))] overflow-y-auto overscroll-contain',
        '[&_[data-slot=command]]:h-auto [&_[data-slot=command]]:max-h-[inherit] [&_[data-slot=command]]:min-h-0',
        '[&_[data-slot=command-input-wrapper]]:shrink-0 [&_[data-slot=command-input]]:text-base sm:[&_[data-slot=command-input]]:text-sm',
        '[&_[data-slot=command-list]]:min-h-0 [&_[data-slot=command-list]]:touch-pan-y [&_[data-slot=command-list]]:overscroll-contain',
      )}
    />
  );
}

export function DropdownMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseDropdownMenuContent>) {
  const container = useContext(FilterOverlayContext);
  return (
    <BaseDropdownMenuContent
      {...props}
      portalContainer={container}
      collisionPadding={12}
      sticky='always'
      className={cn(
        className,
        'max-w-[min(calc(100vw-1.5rem),var(--radix-dropdown-menu-content-available-width))] touch-pan-y overscroll-contain [&_[role^=menuitem]]:min-h-11 sm:[&_[role^=menuitem]]:min-h-8',
      )}
    />
  );
}
