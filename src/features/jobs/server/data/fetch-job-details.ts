import 'server-only';

import { clientEnv } from '@/lib/env/client';
import { type JobDetailsSchema } from '@/features/jobs/schemas';
import { dtoToJobDetails, jobDetailsDto } from '@/features/jobs/server/dtos';
import { fetchSimilarJobs } from './fetch-similar-jobs';

interface FetchJobDetailsProps {
  id: string;
}

export const fetchJobDetails = async ({
  id,
}: FetchJobDetailsProps): Promise<JobDetailsSchema | null> => {
  const url = `${clientEnv.MW_URL}/jobs/details/${id}`;

  const response = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    if (response.status === 404) return null;

    const errorBody = await response.text().catch(() => '');
    throw new Error(
      `Failed to fetch job details: ${response.status}${errorBody ? ` - ${errorBody}` : ''}`,
    );
  }

  const json = await response.json();
  const parsed = jobDetailsDto.safeParse(json);

  if (!parsed.success) {
    console.error(
      '[fetchJobDetails] Validation failed:',
      parsed.error.flatten(),
    );
    return null;
  }

  const similarJobs = await fetchSimilarJobs(id);
  return dtoToJobDetails(parsed.data, similarJobs);
};
