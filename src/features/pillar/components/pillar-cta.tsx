'use client';

import { ArrowRightIcon, LoaderIcon } from 'lucide-react';

import { LinkWithLoader } from '@/components/link-with-loader';

import {
  getPillarFilterHref,
  getPillarHeadline,
} from '@/features/pillar/constants';
import type { PillarFilterContext } from '@/features/pillar/schemas';

interface Props {
  slug: string;
  pillarContext: PillarFilterContext | null;
}

export const PillarCTA = ({ slug, pillarContext }: Props) => {
  const headline = pillarContext ? getPillarHeadline(slug) : 'Jobs';
  const href = getPillarFilterHref(pillarContext);

  return (
    <LinkWithLoader
      href={href}
      className='group flex flex-col items-start gap-1 rounded-2xl border border-border/50 bg-card px-4 py-4 shadow-sm transition-all duration-200 hover:border-border hover:shadow-md'
    >
      {(isPending) => (
        <>
          <p className='text-sm font-semibold text-foreground'>
            Looking for more {headline}?
          </p>

          <span className='flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground'>
            Find more
            {isPending ? (
              <LoaderIcon className='size-4 animate-spin' />
            ) : (
              <ArrowRightIcon className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            )}
          </span>
        </>
      )}
    </LinkWithLoader>
  );
};
