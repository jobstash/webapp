'use client';

import { Button } from '@/lib/shared/ui/base/button';

interface Props {
  resetErrorBoundary: () => void;
}

export const AuthButtonFallback = ({ resetErrorBoundary }: Props) => {
  return (
    <Button
      size='lg'
      variant='secondary'
      className='h-16 w-full rounded-2xl border border-neutral-800/50 bg-sidebar'
      onClick={resetErrorBoundary}
    >
      Try again
    </Button>
  );
};
