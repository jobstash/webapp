import { useRef } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

import { Option } from '@/lib/shared/core/types';

interface UseCommandVirtualizationProps {
  filteredOptions: Option[];
}

/**
 * Command Virtualization
 *
 * Handles the virtualization logic for the command list.
 */
export const useCommandVirtualization = ({
  filteredOptions,
}: UseCommandVirtualizationProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35, // Estimate size for each item
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const scrollToIndex = (index: number) => {
    virtualizer.scrollToIndex(index, {
      align: 'center',
    });
  };

  return {
    parentRef,
    virtualizer,
    virtualOptions,
    scrollToIndex,
  };
};
