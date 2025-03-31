import Link from 'next/link';

import { ENV } from '@/lib/shared/core/envs';

import { JobstashLogo } from '@/lib/shared/ui/svgs/jobstash-logo';

const BRAND_NAME = 'JobStash';
const VERI_LABEL = 'veri.xyz';

export const Brand = () => {
  return (
    <div className='flex h-16 items-center gap-1 px-0 md:gap-3 md:px-4'>
      <Link href={ENV.FRONTEND_URL}>
        <JobstashLogo className='size-10 shrink-0 md:size-12' />
      </Link>
      <div className='flex flex-col justify-center'>
        <Link
          href={ENV.FRONTEND_URL}
          className='mt-1 text-xl leading-5 font-bold md:mt-0'
        >
          {BRAND_NAME}
        </Link>
        <span className='pl-0.5 text-[10px] leading-snug text-white/40 md:text-xs'>
          by
          <Link
            href={ENV.VERI_URL}
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
