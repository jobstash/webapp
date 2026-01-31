'use client';

import Link from 'next/link';

import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { SuggestedPillar } from '@/features/pillar/schemas';
import {
  type PillarCategory,
  PILLAR_CATEGORY_CONFIG,
  getPillarCategory,
} from '@/features/pillar/constants';

interface Props {
  items: SuggestedPillar[];
}

const CATEGORY_HOVER_STYLES: Record<PillarCategory, string> = {
  tag: 'hover:border-emerald-500/40 hover:bg-emerald-500/10',
  classification: 'hover:border-blue-500/40 hover:bg-blue-500/10',
  location: 'hover:border-amber-500/40 hover:bg-amber-500/10',
  commitment: 'hover:border-violet-500/40 hover:bg-violet-500/10',
  locationType: 'hover:border-cyan-500/40 hover:bg-cyan-500/10',
  organization: 'hover:border-rose-500/40 hover:bg-rose-500/10',
  seniority: 'hover:border-orange-500/40 hover:bg-orange-500/10',
  investor: 'hover:border-teal-500/40 hover:bg-teal-500/10',
  fundingRound: 'hover:border-indigo-500/40 hover:bg-indigo-500/10',
  boolean: 'hover:border-slate-500/40 hover:bg-slate-500/10',
};

export const SuggestedPillars = ({ items }: Props) => {
  const handlePillarClick = (item: SuggestedPillar) => {
    const category = getPillarCategory(item.href.slice(1));
    trackEvent(GA_EVENT.PILLAR_CLICKED, {
      pillar_slug: item.href.slice(1),
      pillar_category: category,
      source: 'suggested_pillars',
    });
  };

  if (items.length === 0) return null;

  return (
    <div className='w-full rounded-2xl border border-border/50 bg-card p-4'>
      <span className='text-sm font-semibold'>Explore More Jobs</span>
      <div className='mt-3 flex flex-wrap gap-2'>
        {items.map((item) => {
          const category = getPillarCategory(item.href.slice(1));
          const { dot } = PILLAR_CATEGORY_CONFIG[category];

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handlePillarClick(item)}
              className={cn(
                'group flex max-w-full items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs font-medium',
                'transition-all duration-200',
                'hover:shadow-md',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                'active:scale-[0.98]',
                CATEGORY_HOVER_STYLES[category],
              )}
            >
              <span
                className={cn(
                  'size-1.5 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-125',
                  dot,
                )}
              />
              <span className='truncate text-foreground/60 transition-colors duration-200 group-hover:text-foreground'>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
