'use client';

import dynamic from 'next/dynamic';

export const EligibilityBadge = dynamic(
  () => import('./eligibility-badge').then((mod) => mod.EligibilityBadge),
  {
    ssr: false,
    loading: () => null,
  },
);
