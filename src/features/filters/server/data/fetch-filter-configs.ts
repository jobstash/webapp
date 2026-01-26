import 'server-only';

import {
  dtoToFilterConfig,
  filterConfigDto,
} from '@/features/filters/server/dtos';
import { clientEnv } from '@/lib/env/client';

export const fetchFilterConfigs = async () => {
  const url = `${clientEnv.MW_URL}/jobs/filters`;
  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(
      `Failed to fetch filter configs: ${response.status}${errorBody ? ` - ${errorBody}` : ''}`,
    );
  }

  const json = await response.json();
  const parsed = filterConfigDto.safeParse(json);

  if (!parsed.success) {
    console.error(
      '[fetchFilterConfigs] Validation failed:',
      parsed.error.flatten(),
    );
    throw new Error(
      `Invalid filterConfigs data: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`,
    );
  }

  return dtoToFilterConfig(parsed.data);
};
