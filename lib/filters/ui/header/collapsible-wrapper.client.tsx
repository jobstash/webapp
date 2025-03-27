'use client';

import { cn } from '@/lib/shared/utils';

import { useHeaderStore } from '@/lib/filters/ui/header/store';
import { useCollapsibleHeader } from '@/lib/filters/ui/header/use-collapsible-header';

export const CollapsibleWrapperClient = ({ children }: React.PropsWithChildren) => {
  const isExpanded = useHeaderStore((state) => state.isExpanded);

  useCollapsibleHeader();

  return (
    <div
      className={cn(
        'sticky top-0 z-30 w-full overflow-hidden border border-neutral-800/50 bg-sidebar/30 backdrop-blur-md lg:top-6 lg:mt-6 lg:rounded-2xl',
        {
          'transition-all duration-400 ease-linear': isExpanded,
        },
      )}
      data-collapsible-wrapper
    >
      {children}
    </div>
  );
};
