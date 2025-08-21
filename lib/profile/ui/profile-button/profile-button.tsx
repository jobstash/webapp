'use client';

import { LOADING_LOGOUT_STATES } from '@/lib/auth/core/constants';

import { Button } from '@/lib/shared/ui/base/button';
import { Spinner } from '@/lib/shared/ui/spinner';

import { useAuthActorRef, useAuthSelector } from '@/lib/auth/providers';

export const ProfileButton = () => {
  const authActorRef = useAuthActorRef();
  const isLoading = useAuthSelector((snapshot) =>
    LOADING_LOGOUT_STATES.some((state) => snapshot.matches(state)),
  );

  const handleLogout = () => {
    authActorRef.send({ type: 'LOGOUT' });
  };

  return (
    <Button
      size='lg'
      variant='secondary'
      className='h-10 w-32'
      disabled={isLoading}
      onClick={handleLogout}
    >
      {isLoading ? <Spinner className='size-4' /> : 'Logout'}
    </Button>
  );
};
