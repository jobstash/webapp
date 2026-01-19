import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CtaCardProps {
  applyUrl: string | null;
}

export const CtaCard = ({ applyUrl }: CtaCardProps) => {
  if (!applyUrl) return null;

  return (
    <div className='rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <Button asChild className='w-full' size='lg'>
        <Link href={applyUrl} target='_blank' rel='noopener noreferrer'>
          Apply Now
          <ExternalLinkIcon className='size-4' />
        </Link>
      </Button>
    </div>
  );
};
