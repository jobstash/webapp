'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useMultiSelectFilter = (paramKey: string) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getSelectedItems = useCallback(() => {
    const paramValue = searchParams.get(paramKey);
    return paramValue ? paramValue.split(',') : [];
  }, [searchParams, paramKey]);

  const isItemSelected = useCallback(
    (value: string) => {
      return getSelectedItems().includes(value);
    },
    [getSelectedItems],
  );

  const toggleItem = useCallback(
    (value: string) => {
      const currentSelectedItems = getSelectedItems();
      const newSelectedItems = currentSelectedItems.includes(value)
        ? currentSelectedItems.filter((item) => item !== value)
        : [...currentSelectedItems, value];

      const newParams = new URLSearchParams(searchParams.toString());

      if (newSelectedItems.length > 0) {
        newParams.set(paramKey, newSelectedItems.join(','));
      } else {
        newParams.delete(paramKey);
      }

      router.push(`${pathname}?${newParams.toString()}`);
    },
    [getSelectedItems, searchParams, paramKey, router, pathname],
  );

  return { isItemSelected, toggleItem };
};
