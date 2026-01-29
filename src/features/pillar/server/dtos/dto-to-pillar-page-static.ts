import 'server-only';

import { capitalize } from '@/lib/utils';
import { lookupAddresses } from '@/lib/server/address-lookup';
import { titleCase } from '@/lib/server/utils';
import type { PillarPageStatic } from '@/features/pillar/schemas';
import { dtoToJobListItem } from '@/features/jobs/server/dtos/dto-to-job-list-item';

import type { PillarPageStaticDto } from './pillar-page-static.dto';

const mapSuggestedPillarLabel = (label: string, href: string): string => {
  if (href.startsWith('/l-')) {
    return lookupAddresses(label)?.label ?? capitalize(label);
  }
  if (href.startsWith('/cl-')) {
    return titleCase(label);
  }
  return capitalize(label);
};

export const dtoToPillarPageStatic = (
  dto: PillarPageStaticDto,
): PillarPageStatic => ({
  title: dto.data.title,
  description: dto.data.description,
  jobs: dto.data.jobs.map(dtoToJobListItem),
  suggestedPillars: dto.data.suggestedPillars.map((p) => ({
    ...p,
    label: mapSuggestedPillarLabel(p.label, p.href),
  })),
});
