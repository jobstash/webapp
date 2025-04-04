import { useState } from 'react';

import { useDebounce } from 'ahooks';

const DEBOUNCE_TIME = 500;

export const useCommandState = () => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const disableKeyboardNav = () => setIsKeyboardNavActive(false);
  const enableKeyboardNav = () => setIsKeyboardNavActive(true);

  const debouncedSearchValue = useDebounce(searchValue, { wait: DEBOUNCE_TIME });

  return {
    focusedIndex,
    setFocusedIndex,
    isKeyboardNavActive,
    setIsKeyboardNavActive,
    disableKeyboardNav,
    enableKeyboardNav,
    searchValue,
    debouncedSearchValue,
    setSearchValue,
  };
};
