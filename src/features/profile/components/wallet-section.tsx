'use client';

import { usePrivy } from '@privy-io/react-auth';
import { WalletIcon } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

const truncateAddress = (address: string): string =>
  `${address.slice(0, 6)}\u2026${address.slice(-4)}`;

export const WalletSection = () => {
  const { user, ready } = usePrivy();
  const walletAddress = user?.wallet?.address;

  if (!ready) {
    return (
      <div className='flex items-center gap-3'>
        <Skeleton className='size-10 rounded-full' />
        <div className='flex flex-col gap-1.5'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-3 w-20' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-3'>
      <div className='flex size-10 items-center justify-center rounded-full bg-accent'>
        <WalletIcon className='size-5 text-muted-foreground' />
      </div>
      <div className='flex flex-col gap-1'>
        <span className='font-mono text-sm font-medium'>
          {walletAddress
            ? truncateAddress(walletAddress)
            : 'No wallet connected'}
        </span>
        <span className='text-xs text-muted-foreground'>Connected wallet</span>
      </div>
    </div>
  );
};
