import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

import { getPillarHeadline } from '@/features/pillar/constants';
import type { PillarFilterContext } from '@/features/pillar/schemas';

interface Props {
  slug: string;
  pillarContext: PillarFilterContext;
}

export const PillarCTA = ({ slug, pillarContext }: Props) => {
  const headline = getPillarHeadline(slug);
  const { paramKey, value } = pillarContext;
  const href = `/?${paramKey}=${encodeURIComponent(value)}`;

  return (
    <Link
      href={href}
      className='group flex flex-col gap-1 rounded-2xl border border-border/50 bg-card px-4 py-4 shadow-sm transition-all duration-200 hover:border-border hover:shadow-md'
    >
      <p className='text-sm font-semibold text-foreground'>
        Looking for more {headline}?
      </p>

      <span className='flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground'>
        Find more
        <ArrowRightIcon className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
      </span>
    </Link>
  );
};
