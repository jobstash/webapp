'use client';

import { FULL_PAGE_OVERLAYS } from '@/lib/shared/core/constants';
import { useFullPageOverlayStore } from '@/lib/shared/core/store';

import { FullPageOverlay } from '@/lib/shared/ui/full-page-overlay';

export const FullPageSearchOverlay = () => {
  const active = useFullPageOverlayStore((state) => state.active);
  const isOpen = active === FULL_PAGE_OVERLAYS.SEARCH;
  const close = useFullPageOverlayStore((state) => state.close);

  return (
    <FullPageOverlay isOpen={isOpen} onClose={close}>
      <div className='grid size-full place-items-center'>
        <p>TODO</p>
      </div>
    </FullPageOverlay>
  );
};
