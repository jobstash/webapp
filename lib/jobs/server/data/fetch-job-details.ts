import { MwSchemaError } from '@/lib/shared/core/errors';
import { jobEndpoints } from '@/lib/jobs/core/job-endpoints';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { dtoToJobDetails, jobDetailsDto } from '@/lib/jobs/server/dtos';

export const fetchJobDetails = async (id: string) => {
  const url = jobEndpoints.details(id);
  const response = await kyFetch(url).json();

  const parsed = safeParse('jobDetailsDto', jobDetailsDto, response);
  if (!parsed.success) {
    throw new MwSchemaError('fetchJobDetails', JSON.stringify(parsed.issues[0]));
  }

  return dtoToJobDetails(parsed.output);
};
