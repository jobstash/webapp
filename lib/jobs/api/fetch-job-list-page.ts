import 'server-only';

import { MW_URL } from '@/lib/shared/core/envs';
import { kyFetch } from '@/lib/shared/data/ky-fetch';
import * as v from 'valibot';
import { jobListPageDto } from './dtos';
import { MwSchemaError } from '@/lib/shared/core/errors';
import { dtoToJobListPage } from './dto-to-job-list-page';

interface Props {
  page: number;
  limit?: number;
}

const DEFAULT_LIMIT = 6;

export const fetchJobListPage = async ({ page, limit = DEFAULT_LIMIT }: Props) => {
  const url = `${MW_URL}/jobs/list?page=${page}&limit=${limit}`;

  const response = await kyFetch(url).json();
  const parsed = v.safeParse(jobListPageDto, response);

  if (!parsed.success) {
    throw new MwSchemaError('fetchJobListPage', JSON.stringify(parsed.issues[0]));
  }

  return dtoToJobListPage(parsed.output);
};
