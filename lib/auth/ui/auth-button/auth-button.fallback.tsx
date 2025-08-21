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
      className='h-10 w-32'
      onClick={resetErrorBoundary}
    >
      Try again
    </Button>
  );
};
