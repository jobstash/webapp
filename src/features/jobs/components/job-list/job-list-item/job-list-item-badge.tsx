import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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

const BADGE_TOOLTIPS: Record<string, string> = {
  [JOB_ITEM_BADGE.FEATURED]: 'Sponsored job posting',
  [JOB_ITEM_BADGE.EXPERT]: 'Requires proven web3 experience',
  [JOB_ITEM_BADGE.BEGINNER]: 'Great for those new to web3',
};

export const JobListItemBadge = ({ badge }: JobListItemBadgeProps) => {
  const tooltip = BADGE_TOOLTIPS[badge];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
      </TooltipTrigger>
      {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
    </Tooltip>
  );
};
