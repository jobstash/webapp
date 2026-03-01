'use client';

import dynamic from 'next/dynamic';

const AUTH_BUTTON_PLACEHOLDER = <div className='h-9 min-w-[4.5rem]' />;

export const HeaderAuthButton = dynamic(
  () => import('./header-auth-button').then((mod) => mod.HeaderAuthButton),
  {
    ssr: false,
    loading: () => AUTH_BUTTON_PLACEHOLDER,
  },
);
