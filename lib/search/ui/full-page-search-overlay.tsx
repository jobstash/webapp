'use client';

import { ListFilterIcon } from 'lucide-react';

import { FULL_PAGE_OVERLAYS } from '@/lib/shared/core/constants';
import { useFullPageOverlayStore } from '@/lib/shared/core/store';

import { Button } from '@/lib/shared/ui/base/button';
import { FullPageOverlay } from '@/lib/shared/ui/full-page-overlay';

export const FullPageSearchOverlay = () => {
  const active = useFullPageOverlayStore((state) => state.active);
  const isOpen = active === FULL_PAGE_OVERLAYS.SEARCH;
  const close = useFullPageOverlayStore((state) => state.close);

  const open = useFullPageOverlayStore((state) => state.open);
  const openFilters = () => open(FULL_PAGE_OVERLAYS.FILTERS);

  return (
    <FullPageOverlay isOpen={isOpen} onClose={close}>
      <div className='grid size-full place-items-center'>
        <p>TODO</p>
        <Button onClick={openFilters} variant='secondary' size='icon'>
          <ListFilterIcon className='size-5' />
        </Button>
      </div>
    </FullPageOverlay>
  );
};
