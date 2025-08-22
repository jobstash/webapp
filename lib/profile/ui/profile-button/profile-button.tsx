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

  const content = isLoading ? (
    <Spinner className='size-6' />
  ) : (
    <ProfileAvatar avatar={profileInfo.avatar} name={profileInfo.name} />
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='lg'
          variant='secondary'
          className='flex size-9 items-center justify-center gap-1 rounded-full bg-transparent p-0 ring-offset-1 ring-offset-neutral-800 lg:h-10 lg:w-fit lg:max-w-40 lg:min-w-36 lg:bg-secondary'
          disabled={isLoading}
        >
          {content}
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

const ProfileAvatar = ({ avatar, name }: { avatar: string; name?: string }) => {
  return (
    <div className='flex items-center gap-2.5'>
      <Avatar className='size-9 lg:size-7'>
        <AvatarImage src={avatar} />
        <AvatarFallback className='bg-neutral-700' delayMs={300}>
          {name?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className='hidden max-w-[11ch] min-w-0 flex-1 truncate lg:block'>{name}</span>
    </div>
  );
};
