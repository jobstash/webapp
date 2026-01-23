'use client';

import { useRouter } from '@bprogress/next/app';
import { ArrowRightIcon, LoaderIcon } from 'lucide-react';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const headline = pillarContext ? getPillarHeadline(slug) : 'Jobs';
  const href = getPillarFilterHref(pillarContext);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-busy={isPending || undefined}
      className={cn(
        'group flex flex-col gap-1 rounded-2xl border border-border/50 bg-card px-4 py-4 shadow-sm transition-all duration-200 hover:border-border hover:shadow-md',
        isPending && 'pointer-events-none opacity-50',
      )}
    >
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
    </a>
  );
};
