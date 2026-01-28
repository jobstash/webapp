'use client';

import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ApplyButtonProps {
  applyUrl: string | null;
  isExpertJob: boolean;
  className?: string;
}

export const ApplyButton = ({
  applyUrl,
  isExpertJob,
  className,
}: ApplyButtonProps) => {
  if (!applyUrl && !isExpertJob) return null;

  const handleExpertClick = () => {
    alert('Not Implemented');
  };

  const buttonContent = (
    <>
      <ExternalLinkIcon className='size-4' />
      Apply Now
    </>
  );

  if (isExpertJob) {
    return (
      <Button className={className} size='lg' onClick={handleExpertClick}>
        {buttonContent}
      </Button>
    );
  }

  return (
    <Button asChild className={className} size='lg'>
      <Link href={applyUrl!} target='_blank' rel='noopener noreferrer'>
        {buttonContent}
      </Link>
    </Button>
  );
};
