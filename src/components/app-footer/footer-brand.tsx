import Link from 'next/link';

import { clientEnv } from '@/lib/env/client';
import { JobstashLogo } from '@/components/jobstash-logo';

export const FooterBrand = () => {
  return (
    <div className='flex flex-col gap-4'>
      <Link href={clientEnv.FRONTEND_URL} className='flex items-center gap-2'>
        <JobstashLogo className='size-10' />
        <span className='text-xl font-semibold'>JobStash</span>
      </Link>
      <p className='text-sm text-muted-foreground'>Crypto Native Jobs</p>
    </div>
  );
};
