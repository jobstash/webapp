'use client';

import { createContext, useContext, useState } from 'react';

interface FiltersCtx {
  isAdvancedFiltersOpen: boolean;
  toggleAdvancedFilters: () => void;
}

const FiltersContext = createContext<FiltersCtx>({
  isAdvancedFiltersOpen: false,
  toggleAdvancedFilters: () => null,
});

export const useFiltersContext = () => {
  const ctx = useContext(FiltersContext);
  if (!ctx) {
    throw new Error('useFiltersContext must be used within a FiltersContext');
  }
  return ctx;
};

export const FiltersProvider = ({ children }: React.PropsWithChildren) => {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  const toggleAdvancedFilters = () => {
    setIsAdvancedFiltersOpen((prev) => !prev);
  };

  return (
    <FiltersContext.Provider value={{ isAdvancedFiltersOpen, toggleAdvancedFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};
