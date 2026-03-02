'use client';

import dynamic from 'next/dynamic';

const HERO_CTA_SKELETON = (
  <div className='h-10 w-36 animate-pulse rounded-lg bg-muted' />
);

export const HeroCtaButton = dynamic(
  () => import('./hero-cta-button').then((mod) => mod.HeroCtaButton),
  {
    ssr: false,
    loading: () => HERO_CTA_SKELETON,
  },
);
