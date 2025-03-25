import { Button } from '@/lib/shared/ui/base/button';

export const AuthButton = () => {
  return (
    <Button
      size='lg'
      variant='secondary'
      className='h-16 w-full rounded-2xl border border-neutral-800/50 bg-sidebar'
    >
      Login / Signup
    </Button>
  );
};
