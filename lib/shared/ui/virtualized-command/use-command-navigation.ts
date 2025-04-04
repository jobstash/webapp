import { KeyboardEvent } from 'react';

import { Option } from '@/lib/shared/core/types';

interface UseCommandNavigationProps {
  filteredOptions: Option[];
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  enableKeyboardNav: () => void;
  scrollToIndex: (index: number) => void;
  handleSelect: (value: string) => void;
}

/**
 * Command Keyboard Navigation
 *
 * Handles keyboard navigation (up, down, enter) within the command list.
 */
export const useCommandNavigation = ({
  filteredOptions,
  focusedIndex,
  setFocusedIndex,
  enableKeyboardNav,
  scrollToIndex,
  handleSelect,
}: UseCommandNavigationProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    enableKeyboardNav();
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const newIndex =
          focusedIndex === -1
            ? 0
            : Math.min(focusedIndex + 1, filteredOptions.length - 1);
        setFocusedIndex(newIndex);
        scrollToIndex(newIndex);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const newIndex =
          focusedIndex === -1
            ? filteredOptions.length - 1
            : Math.max(focusedIndex - 1, 0);
        setFocusedIndex(newIndex);
        scrollToIndex(newIndex);
        break;
      }
      case 'Enter': {
        event.preventDefault();
        if (filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex].value);
        }
        break;
      }
      default:
        break;
    }
  };

  return {
    handleKeyDown,
  };
};
