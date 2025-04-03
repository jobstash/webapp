import { createContext, useContext, useState, useTransition } from 'react';

interface FilterItemPopoverCtx {
  open: boolean;
  toggleOpen: () => void;
  isPending: boolean;
}

export const FilterItemPopoverContext = createContext<FilterItemPopoverCtx>({
  open: false,
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
  const [isPending, startTransition] = useTransition();

  const toggleOpen = () => {
    startTransition(() => {
      setOpen((prev) => !prev);
    });
  };

  return (
    <FilterItemPopoverContext.Provider value={{ open, toggleOpen, isPending }}>
      {children}
    </FilterItemPopoverContext.Provider>
  );
};
