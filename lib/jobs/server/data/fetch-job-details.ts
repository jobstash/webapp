import { MwSchemaError } from '@/lib/shared/core/errors';
import { JOB_ENDPOINTS } from '@/lib/jobs/core/endpoints';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { dtoToJobDetails, jobDetailsDto } from '@/lib/jobs/server/dtos';

export const fetchJobDetails = async (id: string) => {
  const url = JOB_ENDPOINTS.details(id);
  const response = await kyFetch(url, { cache: 'force-cache' }).json();

  const parsed = safeParse('jobDetailsDto', jobDetailsDto, response);
  if (!parsed.success) {
    throw new MwSchemaError('fetchJobDetails', JSON.stringify(parsed.issues[0]));
  }

  return dtoToJobDetails(parsed.output);
};
