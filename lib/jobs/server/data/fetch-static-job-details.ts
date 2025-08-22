import 'server-only';

import { KyResponse } from 'ky';

import { CLIENT_ENVS } from '@/lib/shared/core/client.env';
import { MwSchemaError } from '@/lib/shared/core/errors';

import { safeParse } from '@/lib/shared/utils/safe-parse';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

import { dtoToJobDetails, jobDetailsDto } from '@/lib/jobs/server/dtos';

export const fetchStaticJobDetails = async (id: string) => {
  const url = `${CLIENT_ENVS.MW_URL}/jobs/details/${id}`;

  let response: KyResponse<unknown>;

  try {
    response = await kyFetch(url, { cache: 'force-cache' });
  } catch (error) {
    console.error('Error fetching job details:', error);
    return null;
  }

  if (!response.ok) return null;

  let jsonData: unknown;
  try {
    jsonData = await response.json();
  } catch (error) {
    console.error('Error parsing job details:', error);
    return null;
  }

  const parsed = safeParse('jobDetailsDto', jobDetailsDto, jsonData);
  if (!parsed.success) {
    throw new MwSchemaError('fetchJobDetails', JSON.stringify(parsed.error.issues[0]));
  }

  return dtoToJobDetails(parsed.data);
};
