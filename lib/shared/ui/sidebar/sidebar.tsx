import { Brand } from '@/lib/shared/ui/brand';

import { DiscoverSidebar } from './discover-sidebar';
import { ProfileSidebar } from './profile-sidebar';
import { SocialsSidebar } from './socials-sidebar';

/**
 * A sidebar component that appears on the left side of the layout
 */
export const Sidebar = () => {
  return (
    <div className='flex flex-col gap-6'>
      <Brand />
      <DiscoverSidebar />
      <ProfileSidebar />
      <SocialsSidebar />
    </div>
  );
};
