import { FingerprintIcon, GithubIcon, UserRoundIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';

const dummyData = [
  {
    label: 'Portfolio',
    icon: <UserRoundIcon size={20} />,
  },
  {
    label: 'Repositories',
    icon: <GithubIcon size={16} />,
  },
  {
    label: 'Linked Accounts',
    icon: <FingerprintIcon size={16} />,
  },
];

export const ProfileSidebar = () => {
  return (
    <div className='flex w-full flex-col gap-4 rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <h3 className='text-md font-medium'>Profile</h3>
      <div className='flex flex-col gap-4 pl-1'>
        {dummyData.map(({ label, icon }) => (
          <div key={label} className='flex items-center gap-2'>
            <Button variant='secondary' size='lg' className='grow justify-between px-4'>
              <div className='flex items-center gap-2'>
                {icon}
                <span className='text-sm text-neutral-400'>{label}</span>
              </div>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
