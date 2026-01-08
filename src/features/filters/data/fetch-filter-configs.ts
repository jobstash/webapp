import 'server-only';

import { dtoToFilterConfig, filterConfigDto } from '@/features/filters/dtos';
import { clientEnv } from '@/lib/env/client';

export const fetchFilterConfigs = async () => {
  const url = `${clientEnv.MW_URL}/jobs/filters`;
  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    throw new Error(`Failed to fetch filter configs: ${response.status}`);
  }

  const json = await response.json();
  const parsed = filterConfigDto.safeParse(json);

  if (!parsed.success) {
    throw new Error('Invalid filterConfigs data');
  }

  return dtoToFilterConfig(parsed.data);
};
