'use client';

import { useSelector } from '@xstate/store/react';
import { X } from 'lucide-react';

import { FULL_PAGE_OVERLAYS } from '@/lib/shared/core/constants';
import { fullPageOverlayStore } from '@/lib/shared/core/store/full-page-overlay-store';

import { Button } from '@/lib/shared/ui/base/button';
import { FullPageOverlay } from '@/lib/shared/ui/full-page-overlay/full-page-overlay';

export const FullPageMenuOverlay = () => {
  const active = useSelector(fullPageOverlayStore, (state) => state.context.active);
  const isOpen = active === FULL_PAGE_OVERLAYS.MENU;
  const close = () => fullPageOverlayStore.trigger.close();

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
        <p>TODO: mobile full page menu</p>
      </div>
    </FullPageOverlay>
  );
};
