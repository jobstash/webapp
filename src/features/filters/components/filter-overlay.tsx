'use client';

import { createContext, useCallback, useContext, useState } from 'react';

import { cn } from '@/lib/utils';
import { PopoverContent as BasePopoverContent } from '@/components/ui/popover';
import { DropdownMenuContent as BaseDropdownMenuContent } from '@/components/ui/dropdown-menu';

export { Popover, PopoverTrigger } from '@/components/ui/popover';
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
