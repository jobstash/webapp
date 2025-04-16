'use client';

import { useRef, useState } from 'react';

const PLACEHOLDER_TEXT = 'Search 3129 jobs';
const MIN_INPUT_SIZE = PLACEHOLDER_TEXT.length;

export const useSearchInput = () => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Math.max(MIN_INPUT_SIZE, e.target.value.length);
    e.target.size = newSize;
    setInputValue(e.target.value);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === inputRef.current) {
      inputRef.current?.focus();
    }
  };

  const [isFocused, setIsFocused] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Delay blur check to allow clicks within CTA or suggestions
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (
        containerRef.current &&
        !containerRef.current.contains(activeElement) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(activeElement)
      ) {
        setIsFocused(false);
      }
    }, 200);
  };

  return {
    inputValue,
    handleInputChange,
    placeholder: PLACEHOLDER_TEXT,
    size: MIN_INPUT_SIZE,
    inputRef,
    containerRef,
    handleContainerClick,
    isFocused,
    suggestionsRef,
    handleFocus,
    handleBlur,
  };
};
