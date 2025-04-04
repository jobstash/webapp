import { useEffect, useMemo, useState } from 'react';

import { Option } from '@/lib/shared/core/types';

import { fuzzySearch } from '@/lib/shared/utils/fuzzy-search';

interface UseCommandFilteringProps {
  options: Option[];
  searchValue: string;
  setFocusedIndex: (index: number) => void;
}

/**
 * Filter Options
 *
 * Filters the command options based on the search value.
 */
export const useCommandFiltering = ({
  options,
  searchValue,
  setFocusedIndex,
}: UseCommandFilteringProps) => {
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

  const searchSpace = useMemo(
    () => options.map((option) => option.label.replaceAll(' ', '')),
    [options],
  );

  useEffect(() => {
    if (searchValue) {
      const results = fuzzySearch(searchSpace, searchValue, options);
      setFilteredOptions(results);
    } else {
      setFilteredOptions(options);
    }
    setFocusedIndex(0);
  }, [options, searchSpace, searchValue, setFocusedIndex]);

  return {
    filteredOptions,
  };
};
