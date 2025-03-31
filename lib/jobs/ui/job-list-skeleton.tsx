import { cn } from '@/lib/shared/utils';

interface Props {
  className?: string;
}

export const JobListSkeleton = ({ className }: Props) => {
  return <div className={cn('py-20', className)}>{'TODO: <JobListSkeleton />'}</div>;
};
