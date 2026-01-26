'use client';

import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CtaCardProps {
  applyUrl: string | null;
  isExpertJob: boolean;
}

export const CtaCard = ({ applyUrl, isExpertJob }: CtaCardProps) => {
  if (!applyUrl && !isExpertJob) return null;

  const handleExpertClick = () => {
    alert('Not Implemented');
  };

  return (
    <div className='rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      {isExpertJob ? (
        <Button className='w-full' size='lg' onClick={handleExpertClick}>
          Apply Now
          <ExternalLinkIcon className='size-4' />
        </Button>
      ) : (
        <Button asChild className='w-full' size='lg'>
          <Link href={applyUrl!} target='_blank' rel='noopener noreferrer'>
            Apply Now
            <ExternalLinkIcon className='size-4' />
          </Link>
        </Button>
      )}
    </div>
  );
};
