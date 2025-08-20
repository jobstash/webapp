'use client';

import dynamic from 'next/dynamic';

import { LoadingPage } from '@/lib/shared/pages';

export const LazyAuthProvider = dynamic(
  () =>
    import('./auth.provider').then((mod) => ({
      default: mod.AuthProvider,
    })),
  {
    loading: () => <LoadingPage />,
    ssr: false,
  },
);
