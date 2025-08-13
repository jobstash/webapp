import { createStore } from '@xstate/store';

import { FULL_PAGE_OVERLAYS } from '@/lib/shared/core/constants';

type FullPageOverlay = (typeof FULL_PAGE_OVERLAYS)[keyof typeof FULL_PAGE_OVERLAYS];

interface FullPageOverlayContext {
  active: FullPageOverlay | null;
}

export const fullPageOverlayStore = createStore({
  context: {
    active: null,
  } as FullPageOverlayContext,
  on: {
    open: (context, event: { overlay: FullPageOverlay }) => ({
      ...context,
      active: event.overlay,
    }),
    close: (context) => ({
      ...context,
      active: null,
    }),
  },
});
