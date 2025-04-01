import { ClassValue } from 'clsx';

import { cn } from '@/lib/shared/utils';

interface Props {
  className?: ClassValue;
}

export const JobListSkeleton = ({ className }: Props) => {
  return <div className={cn(className)}>{'TODO: <JobListSkeleton />'}</div>;
};
