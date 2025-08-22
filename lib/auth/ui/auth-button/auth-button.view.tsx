import { ArrowRightIcon, UserIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';
import { Spinner } from '@/lib/shared/ui/spinner';

interface Props {
  isLoading: boolean;
  auth?: {
    privy: boolean;
    session: boolean;
  };
  onClick?: () => void;
}

export const AuthButtonView = ({ isLoading, auth, onClick }: Props) => {
  const isInterruptedLogin = auth?.privy && !auth?.session;
  const text = isInterruptedLogin ? 'Continue Login' : 'Login / Signup';
  const Icon = isInterruptedLogin ? ArrowRightIcon : UserIcon;

  return (
    <>
      {/* Mobile */}
      <div className='block lg:hidden'>
        <Button
          size='icon'
          variant='secondary'
          className='size-10 rounded-xl'
          disabled={isLoading}
          onClick={onClick}
        >
          {isLoading ? <Spinner className='size-4' /> : <Icon className='size-5' />}
        </Button>
      </div>
      {/* Desktop */}
      <div className='hidden lg:block'>
        <Button
          size='lg'
          variant='secondary'
          className='h-10 w-40'
          disabled={isLoading}
          onClick={onClick}
        >
          {isLoading ? <Spinner className='size-4' /> : text}
        </Button>
      </div>
    </>
  );
};
