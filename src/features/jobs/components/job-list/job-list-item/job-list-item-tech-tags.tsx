import Link from 'next/link';

import { cn } from '@/lib/utils';
import { type JobTagSchema } from '@/features/jobs/schemas';

interface JobListItemTechTagsProps {
  tags: JobTagSchema[];
  maxVisible?: number;
}

const TAG_COLORS: Record<number, string> = {
  0: 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20',
  1: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20',
  2: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20',
  3: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20',
  4: 'bg-lime-500/10 text-lime-600 dark:text-lime-400 hover:bg-lime-500/20',
  5: 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20',
  6: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20',
  7: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20',
  8: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20',
  9: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20',
  10: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20',
  11: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20',
};

export const JobListItemTechTags = ({
  tags,
  maxVisible = 3,
}: JobListItemTechTagsProps) => {
  if (tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      {visibleTags.map((tag) => (
        <Link
          key={tag.id}
          href={`/?tags=${tag.normalizedName}`}
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
            TAG_COLORS[tag.colorIndex] ?? TAG_COLORS[0],
          )}
        >
          {tag.name}
        </Link>
      ))}
      {remainingCount > 0 && (
        <span className='text-xs text-muted-foreground'>+{remainingCount}</span>
      )}
    </div>
  );
};
