'use client';

import dynamic from 'next/dynamic';

import { LoadingPage } from '@/lib/shared/pages/loading.page';

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
