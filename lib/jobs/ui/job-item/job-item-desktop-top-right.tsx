import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { BookmarkButton } from '@/lib/bookmarks/ui/bookmark-button';

import { JobItemTimestamp } from './job-item-timestamp';

interface Props {
  timestampText: JobItemSchema['timestampText'];
  isUrgentlyHiring: JobItemSchema['isUrgentlyHiring'];
}

export const JobItemDesktopTopRight = ({ timestampText, isUrgentlyHiring }: Props) => {
  return (
    <div className='hidden items-center gap-2 md:flex'>
      <JobItemTimestamp
        timestampText={timestampText}
        isUrgentlyHiring={isUrgentlyHiring}
      />
      <BookmarkButton />
    </div>
  );
};
