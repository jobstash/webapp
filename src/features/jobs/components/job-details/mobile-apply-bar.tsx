'use client';

import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MobileApplyBarProps {
  applyUrl: string | null;
}

export const MobileApplyBar = ({ applyUrl }: MobileApplyBarProps) => {
  if (!applyUrl) return null;

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 lg:hidden',
        'border-t border-border bg-background/95 backdrop-blur-sm',
        'p-4',
      )}
    >
      <Button asChild className='w-full' size='lg'>
        <Link href={applyUrl} target='_blank' rel='noopener noreferrer'>
          Apply Now
          <ExternalLinkIcon className='size-4' />
        </Link>
      </Button>
    </div>
  );
};
