import 'server-only';

import { ENV } from '@/lib/shared/core/envs';
import { MwSchemaError } from '@/lib/shared/core/errors';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { dtoToJobDetails, jobDetailsDto } from '@/lib/jobs/server/dtos';

export const fetchJobDetails = async (id: string) => {
  const url = `${ENV.MW_URL}/jobs/details/${id}`;
  const response = await kyFetch(url, { cache: 'force-cache' }).json();

  const parsed = safeParse('jobDetailsDto', jobDetailsDto, response);
  if (!parsed.success) {
    throw new MwSchemaError('fetchJobDetails', JSON.stringify(parsed.error.issues[0]));
  }

  return dtoToJobDetails(parsed.data);
};
