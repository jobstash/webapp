import { envs } from '@/lib/shared/core/envs';

const BASE_URL = `${envs.MW_URL}/search` as const;
const BASE_PILLAR_URL = `${BASE_URL}/pillar` as const;

export const searchEndpoints = {
  staticPillarSlugs: () => `${BASE_PILLAR_URL}/slugs` as const,
  pillarDeets: (slug: string) =>
    `${BASE_PILLAR_URL}/details?nav=jobs&slug=${slug}` as const,
};
