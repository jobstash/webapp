'use client';

import { SearchIcon } from 'lucide-react';

import { FULL_PAGE_OVERLAYS } from '@/lib/shared/core/constants';
import { fullPageOverlayStore } from '@/lib/shared/core/store/full-page-overlay-store';

import { Button } from '@/lib/shared/ui/base/button';

export const FullPageSearchOverlayTrigger = () => {
  const openFullPage = () =>
    fullPageOverlayStore.trigger.open({ overlay: FULL_PAGE_OVERLAYS.SEARCH });

  return (
    <Button variant='secondary' size='icon' onClick={openFullPage}>
      <SearchIcon className='size-5' />
    </Button>
  );
};
