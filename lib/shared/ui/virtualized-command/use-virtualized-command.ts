import { KeyboardEvent, useEffect, useRef, useState } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

type Option = {
  value: string;
  label: string;
};

interface Props {
  options: Option[];
  onSelect?: (option: string) => void;
}

export const useVirtualizedCommand = ({ options, onSelect }: Props) => {
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const disableKeyboardNav = () => setIsKeyboardNavActive(false);

  const parentRef = useRef(null);

  useEffect(() => {
    if (searchValue) {
      setFilteredOptions(
        options.filter((option) =>
          option.value.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      );
    } else {
      setFilteredOptions(options);
    }
    setFocusedIndex(0);
  }, [options, searchValue]);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const scrollToIndex = (index: number) => {
    virtualizer.scrollToIndex(index, {
      align: 'center',
    });
  };

  const handleSearch = (search: string) => {
    setIsKeyboardNavActive(false);
    setSearchValue(search);
  };

  const handleSelect = (value: string) => {
    onSelect?.(value);
    setSearchValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const newIndex =
            prev === -1 ? 0 : Math.min(prev + 1, filteredOptions.length - 1);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const newIndex =
            prev === -1 ? filteredOptions.length - 1 : Math.max(prev - 1, 0);
          scrollToIndex(newIndex);
          return newIndex;
        });
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
