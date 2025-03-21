import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { GradientText } from '@/lib/shared/ui/gradient-text';
import { jobBadgeIconMap } from '@/lib/jobs/ui/job-icon-map';

interface Props {
  badge: JobItemSchema['badge'];
}

export const JobItemBadge = ({ badge }: Props) => {
  if (!badge) return null;

  return (
    <div className='-mb-1 flex h-8 items-center gap-2'>
      <GradientText text={badge} className='text-sm font-semibold' />
      {jobBadgeIconMap[badge]}
    </div>
  );
};
