import 'server-only';

import type { PillarDetails } from '@/features/pillar/schemas';

import type { PillarDetailsDto } from './pillar-details.dto';

export const dtoToPillarDetails = (dto: PillarDetailsDto): PillarDetails => ({
  title: dto.data.title,
  description: dto.data.description,
});
