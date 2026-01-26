import Link from 'next/link';

import { clientEnv } from '@/lib/env/client';
import { JobstashLogo } from '@/components/jobstash-logo';

export const Brand = () => {
  return (
    <div className='flex h-16 items-center gap-1 px-0 md:gap-2'>
      <Link href={clientEnv.FRONTEND_URL} className='flex items-center gap-2'>
        <JobstashLogo className='size-10 shrink-0 md:size-11' />
        <span className='hidden text-2xl font-semibold lg:flex'>JobStash</span>
      </Link>
    </div>
  );
};
