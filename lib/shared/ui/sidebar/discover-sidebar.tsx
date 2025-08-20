import { BookmarkIcon, Code2Icon, LayoutDashboardIcon } from 'lucide-react';

import { SidebarItems } from './sidebar-items';

const dummyData = [
  {
    label: 'Jobs',
    count: 3129,
    icon: <Code2Icon size={16} />,
    href: '/',
  },
  {
    label: 'Job Folders',
    count: 321,
    icon: <BookmarkIcon size={16} />,
    href: '/folders',
  },
  {
    label: 'Job Boards',
    count: 64,
    icon: <LayoutDashboardIcon size={16} />,
    href: '/boards',
  },
];

export const DiscoverSidebar = () => {
  return (
    <div className='flex w-full flex-col gap-4 rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <h3 className='text-md font-medium'>Discover</h3>
      <SidebarItems items={dummyData} />
    </div>
  );
};
