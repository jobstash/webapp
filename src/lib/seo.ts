import type { Metadata } from 'next';

import { clientEnv } from '@/lib/env/client';

// Leaf-level `robots` metadata replaces the root layout's value wholesale,
// so every leaf robots value must re-apply the ALLOW_INDEXING kill switch.
export const robotsIndexFollow = (): Metadata['robots'] =>
  clientEnv.ALLOW_INDEXING
    ? { index: true, follow: true }
    : { index: false, follow: false };

export const robotsNoindexFollow = (): Metadata['robots'] =>
  clientEnv.ALLOW_INDEXING
    ? { index: false, follow: true }
    : { index: false, follow: false };
