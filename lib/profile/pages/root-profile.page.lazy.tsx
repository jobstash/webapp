'use client';

import dynamic from 'next/dynamic';

import { LoadingPage } from '@/lib/shared/pages';

export const LazyRootProfilePage = dynamic(
  () => import('./root-profile.page').then((mod) => mod.RootProfilePage),
  {
    loading: () => <LoadingPage />,
    ssr: false,
  },
);
