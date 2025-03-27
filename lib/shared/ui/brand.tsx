import Link from 'next/link';

import { envs } from '@/lib/shared/core/envs';

import { JobstashLogo } from '@/lib/shared/ui/svgs/jobstash-logo';

const BRAND_NAME = 'JobStash';
const VERI_LABEL = 'veri.xyz';

export const Brand = () => {
  return (
    <div className='flex h-16 items-center gap-3 px-4'>
      <JobstashLogo className='size-12 shrink-0' />
      <div className='flex flex-col justify-center'>
        <span className='text-xl leading-5 font-bold'>{BRAND_NAME}</span>
        <span className='pl-0.5 text-xs leading-snug text-white/40'>
          by
          <Link
            href={envs.VERI_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='pl-1 hover:underline'
          >
            {VERI_LABEL}
          </Link>
        </span>
      </div>
    </div>
  );
};
