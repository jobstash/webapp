import { create } from 'zustand';

import { FULL_PAGE_OVERLAYS } from '@/lib/shared/core/constants';

type FullPageOverlay = (typeof FULL_PAGE_OVERLAYS)[keyof typeof FULL_PAGE_OVERLAYS];

interface FullPageOverlayState {
  active: FullPageOverlay | null;
  open: (overlay: FullPageOverlay) => void;
  close: () => void;
}

export const useFullPageOverlayStore = create<FullPageOverlayState>((set) => ({
  active: null,
  open: (overlay) => set({ active: overlay }),
  close: () => set({ active: null }),
}));
