import { Brand } from '@/lib/shared/ui/brand';

import { DiscoverSidebar } from './discover-sidebar';
import { ProfileSidebar } from './profile-sidebar';

/**
 * A sidebar component that appears on the left side of the layout
 */
export const AppSidebar = () => {
  return (
    <div className='flex flex-col gap-8'>
      <Brand />
      <DiscoverSidebar />
      <ProfileSidebar />
    </div>
  );
};
