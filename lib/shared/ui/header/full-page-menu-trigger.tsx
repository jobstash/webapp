'use client';

import { MenuIcon } from 'lucide-react';

import { FULL_PAGE_OVERLAYS } from '@/lib/shared/core/constants';
import { fullPageOverlayStore } from '@/lib/shared/core/store/full-page-overlay-store';

import { Button } from '@/lib/shared/ui/base/button';

export const FullPageMenuOverlayTrigger = () => {
  const openFullPage = () =>
    fullPageOverlayStore.trigger.open({ overlay: FULL_PAGE_OVERLAYS.MENU });

  return (
    <Button variant='secondary' size='icon' onClick={openFullPage}>
      <MenuIcon className='size-6' />
    </Button>
  );
};
