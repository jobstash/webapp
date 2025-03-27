import { create } from 'zustand';

interface HeaderState {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  isExpanded: true,
  setIsExpanded: (isExpanded) => set({ isExpanded }),
}));
