import 'server-only';

import { type SimilarJobDto } from '@/features/jobs/server/dtos';

interface FetchSimilarJobsProps {
  id: string;
}

// TODO: Replace with actual API call to /jobs/similar/{id}
export const fetchSimilarJobs = async ({
  id,
}: FetchSimilarJobsProps): Promise<SimilarJobDto[]> => {
  // Suppress unused variable warning - will be used when API is implemented
  void id;

  // Mock data for now - similar jobs endpoint not yet available
  return [
    {
      id: 'sim1',
      shortUUID: 'sim1',
      title: 'Smart Contract Engineer',
      minimumSalary: 140000,
      maximumSalary: 180000,
      salary: null,
      salaryCurrency: null,
      location: 'Remote',
      organization: {
        name: 'Aave',
        logoUrl: null,
        website: 'https://aave.com',
      },
    },
    {
      id: 'sim2',
      shortUUID: 'sim2',
      title: 'Blockchain Developer',
      minimumSalary: 130000,
      maximumSalary: 170000,
      salary: null,
      salaryCurrency: null,
      location: 'San Francisco',
      organization: {
        name: 'Compound',
        logoUrl: null,
        website: 'https://compound.finance',
      },
    },
    {
      id: 'sim3',
      shortUUID: 'sim3',
      title: 'Protocol Engineer',
      minimumSalary: 160000,
      maximumSalary: 200000,
      salary: null,
      salaryCurrency: null,
      location: 'Remote',
      organization: {
        name: 'MakerDAO',
        logoUrl: null,
        website: 'https://makerdao.com',
      },
    },
  ];
};
