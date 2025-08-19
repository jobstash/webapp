import { Button } from '@/lib/shared/ui/base/button';
import { Spinner } from '@/lib/shared/ui/spinner';

interface Props {
  isLoading: boolean;
  onClick?: () => void;
}

export const AuthButtonView = ({ isLoading, onClick }: Props) => {
  return (
    <Button
      size='lg'
      variant='secondary'
      className='h-16 w-full rounded-2xl border border-neutral-800/50 bg-sidebar'
      disabled={isLoading}
      onClick={onClick}
    >
      Login / Signup
      {isLoading && <Spinner className='size-4' />}
    </Button>
  );
};
