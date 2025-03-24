import { Button } from '@/lib/shared/ui/base/button';

import { FiltersAside } from './filters-aside';

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
      <FiltersAside />
    </div>
  );
};
