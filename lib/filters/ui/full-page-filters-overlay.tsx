'use client';

import { X } from 'lucide-react';

import { FULL_PAGE_OVERLAYS } from '@/lib/shared/core/constants';
import { useFullPageOverlayStore } from '@/lib/shared/core/store';

import { Button } from '@/lib/shared/ui/base/button';
import { FullPageOverlay } from '@/lib/shared/ui/full-page-overlay/full-page-overlay';

export const FullPageFiltersOverlay = () => {
  const active = useFullPageOverlayStore((state) => state.active);
  const isOpen = active === FULL_PAGE_OVERLAYS.FILTERS;
  const close = useFullPageOverlayStore((state) => state.close);

  return (
    <FullPageOverlay isOpen={isOpen} onClose={close}>
      <div className='relative grid size-full place-items-center'>
        <Button
          variant='ghost'
          size='icon'
          className='absolute top-4 right-4'
          onClick={close}
        >
          <X className='size-5' />
        </Button>
        <p>TODO: mobile full page filters</p>
      </div>
    </FullPageOverlay>
  );
};
