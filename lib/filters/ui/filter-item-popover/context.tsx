'use client';

import { createContext, useContext, useState, useTransition } from 'react';

interface FilterItemPopoverCtx {
  open: boolean;
  onClose: () => void;
  toggleOpen: () => void;
  isPending: boolean;
}

export const FilterItemPopoverContext = createContext<FilterItemPopoverCtx>({
  open: false,
  onClose: () => null,
  toggleOpen: () => null,
  isPending: false,
});

export const useFilterItemPopoverContext = () => {
  const ctx = useContext(FilterItemPopoverContext);
  if (!ctx)
    throw new Error(
      'useFilterItemPopoverCtx must be used within a FilterItemPopoverContext',
    );
  return ctx;
};

export const FilterItemPopoverProvider = ({ children }: React.PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);

  const [isPending, startTransition] = useTransition();

  const toggleOpen = () => {
    startTransition(() => {
      setOpen((prev) => !prev);
    });
  };

  return (
    <FilterItemPopoverContext.Provider value={{ open, onClose, toggleOpen, isPending }}>
      {children}
    </FilterItemPopoverContext.Provider>
  );
};
