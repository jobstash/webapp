import { useState } from 'react';

export const useCommandState = () => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const disableKeyboardNav = () => setIsKeyboardNavActive(false);
  const enableKeyboardNav = () => setIsKeyboardNavActive(true);

  return {
    focusedIndex,
    setFocusedIndex,
    isKeyboardNavActive,
    setIsKeyboardNavActive,
    disableKeyboardNav,
    enableKeyboardNav,
    searchValue,
    setSearchValue,
  };
};
