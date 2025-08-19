'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { AuthFallbackProvider } from './auth-fallback.provider';

const DynamicAuthProvider = dynamic(
  () =>
    import('./auth.provider').then((mod) => ({
      default: mod.AuthProvider,
    })),
  {
    ssr: false,
  },
);

export const LazyAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<AuthFallbackProvider>{children}</AuthFallbackProvider>}>
      <DynamicAuthProvider>{children}</DynamicAuthProvider>
    </Suspense>
  );
};
