'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { useDebounce } from '@/hooks';

const DEBOUNCE_MS = 500;

interface UseRemoteVirtualizedCommandProps<T> {
  queryKeyPrefix: string;
  endpoint: (query: string) => string;
  responseToValues: (data: T) => string[];
  initialValues: string[];
  selectedValues: string[];
  excludeValues?: string[];
  fetchOptions?: RequestInit;
  onSelect?: (value: string) => void;
}

interface UseRemoteVirtualizedCommandReturn {
  searchValue: string;
  setSearchValue: (value: string) => void;
  debouncedSearch: string;
  isLoading: boolean;
  filteredValues: string[];
  isEmpty: boolean;
  handleSelect: (value: string) => void;
}

export const useRemoteVirtualizedCommand = <T>({
  queryKeyPrefix,
  endpoint,
  responseToValues,
  initialValues,
  selectedValues,
  excludeValues = [],
  fetchOptions,
  onSelect,
}: UseRemoteVirtualizedCommandProps<T>): UseRemoteVirtualizedCommandReturn => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, DEBOUNCE_MS);

  const { data, isLoading } = useQuery<string[]>({
    queryKey: [queryKeyPrefix, debouncedSearch],
    queryFn: async () => {
      const url = endpoint(debouncedSearch);
      const res = await fetch(url, fetchOptions);
      const json = await res.json();
      return responseToValues(json);
    },
    enabled: !!debouncedSearch,
  });

  const values = data ?? initialValues;
  const filteredValues = isLoading
    ? []
    : values.filter(
        (v) => !selectedValues.includes(v) && !excludeValues.includes(v),
      );
  const isEmpty = filteredValues.length === 0;

  const handleSelect = (value: string) => {
    onSelect?.(value);
    setSearchValue('');
  };

  return {
    searchValue,
    setSearchValue,
    debouncedSearch,
    isLoading,
    filteredValues,
    isEmpty,
    handleSelect,
  };
};
