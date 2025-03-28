import { ENV } from '@/lib/shared/core/envs';

const BASE_URL = `${ENV.MW_URL}/search` as const;
const BASE_PILLAR_URL = `${BASE_URL}/pillar` as const;
const BASE_PARAM = `nav=jobs`;

export const SEARCH_ENDPOINTS = {
  staticPillarSlugs: () => `${BASE_PILLAR_URL}/slugs?${BASE_PARAM}` as const,
  pillarDeets: (slug: string) =>
    `${BASE_PILLAR_URL}/details?${BASE_PARAM}&slug=${slug}` as const,
};
