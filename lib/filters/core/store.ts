import { create } from 'zustand';

import { FilterConfigItemSchema } from '@/lib/filters/core/schemas';

interface FilterStore {
  initialized: boolean;
  setInitialized: (initialized: boolean) => void;
  activeFilters: FilterConfigItemSchema[];
  activeLabels: Set<string>;
  addActiveFilter: (filter: FilterConfigItemSchema) => void;
  removeActiveFilter: (label: string) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  initialized: false,
  setInitialized: (initialized) => set({ initialized }),
  activeFilters: [],
  activeLabels: new Set<string>(),
  addActiveFilter: (filter) =>
    set((state) => ({
      activeFilters: [...state.activeFilters, filter],
      activeLabels: new Set([...state.activeLabels, filter.label]),
    })),
  removeActiveFilter: (label) =>
    set((state) => {
      const newActiveLabels = new Set(state.activeLabels);
      newActiveLabels.delete(label);
      return {
        activeFilters: state.activeFilters.filter((filter) => filter.label !== label),
        activeLabels: newActiveLabels,
      };
    }),
}));
