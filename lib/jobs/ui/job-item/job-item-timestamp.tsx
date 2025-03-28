import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { cn } from '@/lib/shared/utils';

interface Props {
  timestampText: JobItemSchema['timestampText'];
  isUrgentlyHiring: JobItemSchema['isUrgentlyHiring'];
}

export const JobItemTimestamp = ({ timestampText, isUrgentlyHiring }: Props) => {
  return (
    <span
      className={cn('text-xs text-neutral-400', {
        'font-semibold text-white': isUrgentlyHiring,
      })}
    >
      {timestampText}
    </span>
  );
};
