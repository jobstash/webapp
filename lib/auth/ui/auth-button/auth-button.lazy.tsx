'use client';

import dynamic from 'next/dynamic';

import { AuthButtonSkeleton } from './auth-button.skeleton';

export const AuthButton = dynamic(
  () => import('./auth-button').then((mod) => mod.AuthButton),
  {
    loading: () => <AuthButtonSkeleton />,
    ssr: false,
  },
);
