'use client';

import { createContext, useContext } from 'react';
import { useRouter } from '@bprogress/next/app';
import { useSearchParams } from 'next/navigation';

import type { PillarFilterContext } from '@/features/pillar/schemas';
import {
  PILLAR_PUBLICATION_DATE_VALUE,
  PUBLICATION_DATE_PARAM_KEY,
} from '@/features/filters/constants';
import { buildFilterModeHref } from '@/features/filters/utils/build-filter-mode-href';

export interface PillarFilterModeValue {
  /**
   * The pillar's implied criteria, rendered as visually-active chips. These
   * never touch the URL — pillar pages stay static — but become real query
   * params when the user changes anything.
   */
  baseParams: Record<string, string>;
  /** Leaves pillar mode: navigates to the home page in real filter mode. */
  navigate: (changes: Record<string, string | null>) => void;
}

const PillarFilterModeContext = createContext<PillarFilterModeValue | null>(
  null,
);

/** Returns null outside pillar pages — normal (URL-driven) filter mode. */
export const usePillarFilterMode = () => useContext(PillarFilterModeContext);

interface ProviderProps {
  pillarContext: PillarFilterContext | null;
  children: React.ReactNode;
}

export const PillarFilterModeProvider = ({
  pillarContext,
  children,
}: ProviderProps) => {
  const router = useRouter();
  const query = useSearchParams();
  const { page: _page, ...filters } = Object.fromEntries(query.entries());

  const baseParams: Record<string, string> = {
    ...(pillarContext?.paramKey === 'organizationId' ||
    pillarContext?.paramKey === 'organizations'
      ? {}
      : { [PUBLICATION_DATE_PARAM_KEY]: PILLAR_PUBLICATION_DATE_VALUE }),
    ...filters,
    ...(pillarContext ? { [pillarContext.paramKey]: pillarContext.value } : {}),
    ...(pillarContext?.organizationId
      ? { organizationId: pillarContext.organizationId }
      : {}),
  };

  const navigate = (changes: Record<string, string | null>) => {
    router.push(
      buildFilterModeHref(baseParams, {
        ...changes,
        ...('organizations' in changes ? { organizationId: null } : {}),
      }),
    );
  };

  return (
    <PillarFilterModeContext.Provider value={{ baseParams, navigate }}>
      {children}
    </PillarFilterModeContext.Provider>
  );
};
