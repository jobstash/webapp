import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { Button } from '@/lib/shared/ui/base/button';
import { Divider } from '@/lib/shared/ui/divider';

interface Props {
  tags: JobItemSchema['tags'];
}

export const JobItemTags = ({ tags }: Props) => {
  if (tags.length === 0) return null;

  return (
    <>
      <Divider />
      <div className='flex flex-wrap items-center gap-2'>
        {tags.map((tag) => (
          <Button
            key={tag.id}
            size='xs'
            variant='secondary'
            className='rounded-sm border-muted text-xs text-foreground/80 uppercase'
          >
            {tag.name}
          </Button>
        ))}
      </div>
    </>
  );
};
