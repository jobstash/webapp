import Image from 'next/image';

import { ClassValue } from 'clsx';

import { cn } from '@/lib/shared/utils';

type JobstashLogoProps = {
  className?: ClassValue;
};

export const JobstashLogo = ({ className }: JobstashLogoProps) => {
  return (
    <div className={cn('relative', 'size-12', className)}>
      <Image
        fill
        priority
        quality={100}
        src='/jobstash-logo.png'
        alt='JobStash Logo'
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};
