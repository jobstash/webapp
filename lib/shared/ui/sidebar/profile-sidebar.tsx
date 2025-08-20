import { FingerprintIcon, TerminalIcon, UserRoundIcon } from 'lucide-react';

import { SidebarItems } from './sidebar-items';

const dummyData = [
  {
    label: 'Profile',
    icon: <UserRoundIcon size={20} />,
    href: '/profile',
  },
  {
    label: 'Your Skills',
    icon: <TerminalIcon size={16} />,
    href: '/skills',
  },
  {
    label: 'Linked Accounts',
    icon: <FingerprintIcon size={16} />,
    href: '/accounts',
  },
];

export const ProfileSidebar = () => {
  return (
    <div className='flex w-full flex-col gap-4 rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <h3 className='text-md font-medium'>Portfolio</h3>
      <SidebarItems items={dummyData} />
    </div>
  );
};
