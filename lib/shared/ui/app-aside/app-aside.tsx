import { Button } from '@/lib/shared/ui/base/button';

import { TopTags } from './top-tags';

/**
 * An aside component that appears on the right side of the layout
 */
export const AppAside = () => {
  return (
    <div className='flex flex-col gap-8'>
      <Button
        size='lg'
        variant='secondary'
        className='h-16 w-full rounded-2xl border border-neutral-800/50 bg-sidebar'
      >
        Login / Signup
      </Button>

      <TopTags />

      <div className='flex h-96 w-full items-center justify-center rounded-2xl border border-neutral-800/50 bg-sidebar px-4'>
        <span>Pillar Filters</span>
      </div>
    </div>
  );
};
