'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

const SearchToolsContext = createContext<{
  target: HTMLDivElement | null;
  setTarget: (target: HTMLDivElement | null) => void;
} | null>(null);

export const SearchToolsProvider = ({ children }: { children: ReactNode }) => {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  return (
    <SearchToolsContext value={{ target, setTarget }}>
      {children}
    </SearchToolsContext>
  );
};

export const SearchToolsSlot = () => {
  const tools = useContext(SearchToolsContext);
  return (
    <div ref={tools?.setTarget} className='shrink-0 empty:hidden lg:hidden' />
  );
};

export const useSearchToolsTarget = () =>
  useContext(SearchToolsContext)?.target ?? null;
