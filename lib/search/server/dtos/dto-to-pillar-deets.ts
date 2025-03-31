import 'server-only';

import { PillarDeetsSchema } from '@/lib/search/core/schemas';

import { PillarDeetsDto } from '@/lib/search/server/dtos/pillar-dtos';

export const dtoToPillarDeets = (dto: PillarDeetsDto): PillarDeetsSchema => {
  return dto;
};
