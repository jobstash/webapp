import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { Divider } from '@/lib/shared/ui/divider';
import { BookmarkButton } from '@/lib/bookmarks/ui/bookmark-button';

import { JobItemTimestamp } from './job-item-timestamp';

interface Props {
  timestampText: JobItemSchema['timestampText'];
  isUrgentlyHiring: JobItemSchema['isUrgentlyHiring'];
}

export const JobItemMobileFooter = ({ timestampText, isUrgentlyHiring }: Props) => {
  return (
    <div className='flex flex-col gap-4 md:hidden'>
      <Divider />
      <div className='flex w-full items-center justify-between gap-2'>
        <JobItemTimestamp
          timestampText={timestampText}
          isUrgentlyHiring={isUrgentlyHiring}
        />
        <BookmarkButton />
      </div>
    </div>
  );
};
