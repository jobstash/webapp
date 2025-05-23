import { Brand } from '@/lib/shared/ui/brand';

import { FullPageMenuOverlayTrigger } from './full-page-menu-trigger';
import { FullPageSearchOverlayTrigger } from './full-page-search-trigger';

export const MobileHeader = () => {
  return (
    <div className='flex h-16 w-full items-center justify-between px-2 py-4 md:hidden'>
      <Brand />
      <div className='flex items-center justify-end gap-2'>
        <FullPageSearchOverlayTrigger />
        <FullPageMenuOverlayTrigger />
      </div>
    </div>
  );
};
