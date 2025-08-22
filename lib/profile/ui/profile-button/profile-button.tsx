'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { LogOutIcon, UserIcon } from 'lucide-react';

import { LOADING_LOGOUT_STATES } from '@/lib/auth/core/constants';

import { useProfileInfo } from '@/lib/profile/hooks';

import { Avatar, AvatarFallback, AvatarImage } from '@/lib/shared/ui/base/avatar';
import { Button } from '@/lib/shared/ui/base/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/lib/shared/ui/base/dropdown-menu';
import { Spinner } from '@/lib/shared/ui/spinner';

import { useAuthActorRef, useAuthSelector } from '@/lib/auth/providers';

export const ProfileButton = () => {
  const authActorRef = useAuthActorRef();
  const isLoadingAuth = useAuthSelector((snapshot) =>
    LOADING_LOGOUT_STATES.some((state) => snapshot.matches(state)),
  );

  const router = useRouter();
  const handleLogout = () => {
    authActorRef.send({ type: 'LOGOUT' });
    router.push('/');
  };

  const { data: profileInfo } = useProfileInfo();
  const isLoading = isLoadingAuth || !profileInfo;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='lg'
          variant='secondary'
          className='flex h-10 w-fit max-w-40 min-w-36 items-center justify-center gap-1'
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner className='size-6' />
          ) : (
            <div className='flex items-center gap-2.5'>
              <Avatar className='size-7'>
                <AvatarImage src={profileInfo.avatar} />
                <AvatarFallback className='bg-neutral-700' delayMs={300}>
                  {profileInfo.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className='max-w-[11ch] min-w-0 flex-1 truncate'>
                {profileInfo.name}
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link href='/profile'>
            <UserIcon className='size-4.5' />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='text-destructive' onClick={handleLogout}>
          <LogOutIcon className='size-4 text-destructive' />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
