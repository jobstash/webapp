'use client';

import dynamic from 'next/dynamic';

export const PrivyClientProvider = dynamic(
  () => import('./privy-provider').then((mod) => mod.PrivyClientProvider),
  { ssr: false },
);
