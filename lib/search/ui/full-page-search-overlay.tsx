'use client';

import { ListFilterIcon, X } from 'lucide-react';

import { FULL_PAGE_OVERLAYS } from '@/lib/shared/core/constants';
import { useFullPageOverlayStore } from '@/lib/shared/core/store';

import { Button } from '@/lib/shared/ui/base/button';
import { FullPageOverlay } from '@/lib/shared/ui/full-page-overlay/full-page-overlay';

export const FullPageSearchOverlay = () => {
  const active = useFullPageOverlayStore((state) => state.active);
  const isOpen = active === FULL_PAGE_OVERLAYS.SEARCH;
  const close = useFullPageOverlayStore((state) => state.close);

  const open = useFullPageOverlayStore((state) => state.open);
  const openFilters = () => open(FULL_PAGE_OVERLAYS.FILTERS);

  return (
    <FullPageOverlay isOpen={isOpen} onClose={close}>
      <Button
        variant='ghost'
        size='icon'
        className='absolute top-4 right-4'
        onClick={close}
      >
        <X className='size-5' />
      </Button>
      <div className='grid size-full place-items-center'>
        <div className='flex flex-col gap-4'>
          <p>TODO: mobile full page search</p>
          <div className='flex items-center gap-4'>
            <span>TODO: Placement: </span>
            <Button onClick={openFilters} variant='secondary' size='icon'>
              <ListFilterIcon className='size-5' />
            </Button>
          </div>
        </div>
      </div>
    </FullPageOverlay>
  );
};
