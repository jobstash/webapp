'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

export const EligibilityCta = dynamic(
  () => import('./eligibility-cta').then((mod) => mod.EligibilityCta),
  {
    ssr: false,
    loading: () => <Skeleton className='h-6 w-24 rounded-md' />,
  },
);
