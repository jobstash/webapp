import { StaticPillarSlugsSchema } from '@/lib/search/core/schemas';

import { PillarSlugsDto } from '@/lib/search/server/dtos/pillar-dtos';

export const dtoToStaticPillarSlugs = (dto: PillarSlugsDto): StaticPillarSlugsSchema => {
  return dto;
};
