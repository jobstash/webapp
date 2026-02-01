'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

export const HeaderAuthButton = dynamic(
  () => import('./header-auth-button').then((mod) => mod.HeaderAuthButton),
  {
    ssr: false,
    loading: () => <Skeleton className='h-10 w-32 rounded-lg lg:w-40' />,
  },
);
