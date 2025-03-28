import { faker } from '@faker-js/faker';

import { ENV } from '@/lib/shared/core/envs';
import { JobListPageSchema } from '@/lib/jobs/core/schemas';

import { fakeJobItem } from '@/lib/jobs/test-utils/fake-job-item';

export const fakeJobListQueryPage = (override?: Partial<JobListPageSchema>) => {
  const { page: overridePage, ...rest } = override ?? {};
  const page = overridePage ?? faker.number.int({ min: 1, max: 100 });
  faker.seed(page);
  return {
    page,
    total: faker.number.int({ min: 1, max: 5000 }),
    data: Array.from({ length: ENV.PAGE_SIZE }, fakeJobItem),
    ...rest,
  };
};
