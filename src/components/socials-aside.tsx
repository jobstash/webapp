'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

import { SOCIALS, SOCIALS_CONTAINER } from './socials-aside.shared';

const SocialsAsideSkeleton = () => (
  <div className={SOCIALS_CONTAINER}>
    {SOCIALS.map(({ label }) => (
      <div key={label} className='flex items-center gap-2'>
        <Skeleton className='h-9 w-12' />
      </div>
    ))}
  </div>
);

// The Radix Tooltip subtree fails to render server-side when placed in the
// non-suspended page shell (a Next 16 streaming-SSR quirk), causing hydration
// mismatches. Render it client-only behind a same-size skeleton (no layout shift).
const SocialsAsideContent = dynamic(() => import('./socials-aside-content'), {
  ssr: false,
  loading: () => <SocialsAsideSkeleton />,
});

export const SocialsAside = () => <SocialsAsideContent />;
