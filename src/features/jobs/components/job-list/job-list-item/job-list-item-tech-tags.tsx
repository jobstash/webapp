import { ChevronRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { LinkWithLoader } from '@/components/link-with-loader';
import { type JobTagSchema } from '@/features/jobs/schemas';

interface JobListItemTechTagsProps {
  tags: JobTagSchema[];
}

const TAG_COLORS: Record<number, string> = {
  0: 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 ring-red-500/20',
  1: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 ring-orange-500/20',
  2: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 ring-amber-500/20',
  3: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 ring-yellow-500/20',
  4: 'bg-lime-500/10 text-lime-600 dark:text-lime-400 hover:bg-lime-500/20 ring-lime-500/20',
  5: 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 ring-green-500/20',
  6: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 ring-emerald-500/20',
  7: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 ring-teal-500/20',
  8: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 ring-cyan-500/20',
  9: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 ring-sky-500/20',
  10: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 ring-blue-500/20',
  11: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 ring-violet-500/20',
};

export const JobListItemTechTags = ({ tags }: JobListItemTechTagsProps) => {
  if (tags.length === 0) return null;

  return (
    <details className='group'>
      {/* Toggle - positioned first for better UX, matches org details pattern */}
      <summary
        className={cn(
          'mb-1.5 inline-flex cursor-pointer list-none items-center gap-1 group-open:mb-2',
          'text-xs text-muted-foreground',
          'transition-colors duration-150',
          'hover:text-foreground',
          '[&::-webkit-details-marker]:hidden',
        )}
      >
        <ChevronRightIcon
          className='size-3.5 transition-transform duration-200 group-open:rotate-90'
          aria-hidden='true'
        />
        <span className='group-open:hidden'>View all {tags.length} skills</span>
        <span className='hidden group-open:inline'>Hide skills</span>
      </summary>

      {/*
        All tags rendered in DOM for crawlers.
        Collapsed: max-h-7 clips to single row.
        Expanded: max-h-none shows all.
      */}
      <div
        className={cn(
          'flex flex-wrap items-center gap-2 overflow-hidden',
          'max-h-7 group-open:max-h-none',
          'pl-4 transition-[max-height] duration-200',
        )}
      >
        {tags.map((tag) => (
          <LinkWithLoader
            key={tag.id}
            href={`/t-${tag.normalizedName}`}
            className={cn(
              'rounded-md px-2 py-0.5 text-xs font-medium',
              'ring-1 transition-all duration-150',
              TAG_COLORS[tag.colorIndex] ?? TAG_COLORS[0],
            )}
          >
            {tag.name}
          </LinkWithLoader>
        ))}
      </div>
    </details>
  );
};
