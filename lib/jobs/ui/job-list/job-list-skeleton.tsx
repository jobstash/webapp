import { ClassValue } from 'clsx';

import { cn } from '@/lib/shared/utils';

interface Props {
  className?: ClassValue;
}

export const JobListSkeleton = ({ className }: Props) => {
  return (
    <div className={cn('h-[600px] w-full bg-sidebar', className)}>
      {'TODO: <JobListSkeleton />'}
    </div>
  );
};
