import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';

interface JobListItemBadgeProps {
  badge: string;
}

const BADGE_STYLES: Record<string, string> = {
  [JOB_ITEM_BADGE.FEATURED]: cn(
    'bg-gradient-to-r from-amber-500/15 to-orange-500/15',
    'text-amber-600 dark:text-amber-400',
    'ring-1 ring-amber-500/20',
  ),
  [JOB_ITEM_BADGE.EXPERT]: cn(
    'bg-gradient-to-r from-violet-500/15 to-purple-500/15',
    'text-violet-600 dark:text-violet-400',
    'ring-1 ring-violet-500/20',
  ),
  [JOB_ITEM_BADGE.BEGINNER]: cn(
    'bg-gradient-to-r from-emerald-500/15 to-green-500/15',
    'text-emerald-600 dark:text-emerald-400',
    'ring-1 ring-emerald-500/20',
  ),
};

export const JobListItemBadge = ({ badge }: JobListItemBadgeProps) => {
  return (
    <Badge
      variant='outline'
      className={cn(
        'rounded-md border-transparent py-1 tracking-wide',
        BADGE_STYLES[badge] ??
          'bg-muted text-muted-foreground ring-1 ring-border',
      )}
    >
      {badge}
    </Badge>
  );
};
