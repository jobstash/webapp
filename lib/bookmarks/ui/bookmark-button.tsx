import { Button } from '@/lib/shared/ui/base/button';
import { BookmarkIcon } from '@/lib/shared/ui/svgs/bookmark-icon';

export const BookmarkButton = () => {
  return (
    <Button variant='secondary' size='icon' className='size-6 rounded-sm'>
      <BookmarkIcon className='size-4' />
    </Button>
  );
};
