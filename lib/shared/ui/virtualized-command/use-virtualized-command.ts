import { Option } from '@/lib/shared/core/types';

import { useCommandFiltering } from './use-command-filtering';
import { useCommandNavigation } from './use-command-navigation';
import { useCommandState } from './use-command-state';
import { useCommandVirtualization } from './use-command-virtualization';

interface UseVirtualizedCommandProps {
  options: Option[];
  onSelect?: (option: string) => void;
}

/**
 * Virtualized Command Hook
 *
 * Composes state, filtering, virtualization, and navigation hooks
 * for a virtualized command component.
 */
export const useVirtualizedCommand = ({
  options,
  onSelect,
}: UseVirtualizedCommandProps) => {
  const {
    focusedIndex,
    setFocusedIndex,
    isKeyboardNavActive,
    disableKeyboardNav,
    enableKeyboardNav,
    searchValue,
    setSearchValue,
  } = useCommandState();

  const { filteredOptions } = useCommandFiltering({
    options,
    searchValue,
    setFocusedIndex,
  });

  const { parentRef, virtualizer, virtualOptions, scrollToIndex } =
    useCommandVirtualization({ filteredOptions });

  const handleSearch = (search: string) => {
    disableKeyboardNav();
    setSearchValue(search);
  };

  const handleSelect = (value: string) => {
    onSelect?.(value);
    setSearchValue(''); // Reset search value on select
  };

  const { handleKeyDown } = useCommandNavigation({
    filteredOptions,
    focusedIndex,
    setFocusedIndex,
    enableKeyboardNav,
    scrollToIndex,
    handleSelect,
  });

  return {
    searchValue,
    filteredOptions,
    focusedIndex,
    setFocusedIndex,
    isKeyboardNavActive,
    disableKeyboardNav,
    parentRef,
    virtualizer,
    virtualOptions,
    handleSearch,
    handleKeyDown,
    handleSelect,
  };
};
