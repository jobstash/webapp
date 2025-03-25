import { BookmarkIcon, Code2Icon, LayoutDashboardIcon } from 'lucide-react';

import { formatNumber } from '@/lib/shared/utils/format-number';

import { Badge } from '@/lib/shared/ui/base/badge';
import { Button } from '@/lib/shared/ui/base/button';

const dummyData = [
  {
    label: 'Jobs',
    count: 3129,
    icon: <Code2Icon size={16} />,
  },
  {
    label: 'Job Folders',
    count: 321,
    icon: <BookmarkIcon size={16} />,
  },
  {
    label: 'Job Boards',
    count: 64,
    icon: <LayoutDashboardIcon size={16} />,
  },
];

export const DiscoverSidebar = () => {
  return (
    <div className='flex w-full flex-col gap-4 rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <h3 className='text-md font-medium'>Discover</h3>
      <div className='flex flex-col gap-4 pl-1'>
        {dummyData.map(({ label, icon, count }) => (
          <div key={label} className='flex items-center gap-2'>
            <Button variant='secondary' size='lg' className='grow justify-between px-4'>
              <div className='flex items-center gap-2'>
                {icon}
                <span className='text-sm text-neutral-400'>{label}</span>
              </div>
              <Badge variant='secondary' className='rounded-sm bg-white/5'>
                {formatNumber(count)}
              </Badge>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
