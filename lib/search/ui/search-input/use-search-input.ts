import { useRef, useState } from 'react';

const PLACEHOLDER_TEXT = 'Search 3129 jobs';
const MIN_INPUT_SIZE = PLACEHOLDER_TEXT.length;

export const useSearchInput = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Math.max(MIN_INPUT_SIZE, e.target.value.length);
    e.target.size = newSize;
    setInputValue(e.target.value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return {
    inputValue,
    handleInputChange,
    placeholder: PLACEHOLDER_TEXT,
    size: MIN_INPUT_SIZE,
    inputRef,
    handleContainerClick,
  };
};
