'use client';

import Link from 'next/link';

import { LogOutIcon, UserIcon } from 'lucide-react';

import { LOADING_LOGOUT_STATES } from '@/lib/auth/core/constants';

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
  const isLoading = useAuthSelector((snapshot) =>
    LOADING_LOGOUT_STATES.some((state) => snapshot.matches(state)),
  );

  const handleLogout = () => {
    authActorRef.send({ type: 'LOGOUT' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='lg'
          variant='secondary'
          className='flex h-10 w-40 items-center justify-start gap-0.5 px-2'
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner className='size-6' />
          ) : (
            <Avatar className='size-7'>
              <AvatarImage src='https://github.com/shadcn.pngx' />
              <AvatarFallback className='bg-neutral-700'>CN</AvatarFallback>
            </Avatar>
          )}
          <span className='min-w-0 flex-1 truncate'>duckdegen.eth</span>
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
