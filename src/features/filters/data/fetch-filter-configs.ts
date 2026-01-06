import 'server-only';

import { dtoToFilterConfig, filterConfigDto } from '@/features/filters/dtos';
import { clientEnv } from '@/lib/env/client';
import { cacheLife } from 'next/cache';

export const fetchFilterConfigs = async () => {
  'use cache';
  cacheLife('hours');

  const url = `${clientEnv.MW_URL}/jobs/filters`;
  const response = await fetch(url);

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
