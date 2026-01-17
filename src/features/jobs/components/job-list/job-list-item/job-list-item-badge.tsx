import { cn } from '@/lib/utils';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';

interface JobListItemBadgeProps {
  badge: string;
}

const BADGE_STYLES: Record<string, string> = {
  [JOB_ITEM_BADGE.FEATURED]:
    'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  [JOB_ITEM_BADGE.EXPERT]:
    'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  [JOB_ITEM_BADGE.BEGINNER]:
    'bg-green-500/10 text-green-600 dark:text-green-400',
};

export const JobListItemBadge = ({ badge }: JobListItemBadgeProps) => {
  return (
    <span
      className={cn(
        'absolute top-5 right-5 rounded-full px-2 py-0.5 text-xs font-medium',
        BADGE_STYLES[badge] ?? 'bg-muted text-muted-foreground',
      )}
    >
      {badge}
    </span>
  );
};
