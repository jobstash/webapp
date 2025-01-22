import { faker } from '@faker-js/faker';

import { PAGE_SIZE } from '@/lib/shared/core/envs';
import { JobListPageSchema } from '@/lib/jobs/core/schemas';

import { fakeJobListItem } from '@/lib/jobs/test-utils/fake-job-list-item';

export const fakeJobListQueryPage = (override?: Partial<JobListPageSchema>) => {
  const { page: overridePage, ...rest } = override ?? {};
  const page = overridePage ?? faker.number.int({ min: 1, max: 100 });
  faker.seed(page);
  return {
    page,
    total: faker.number.int({ min: 1, max: 5000 }),
    data: Array.from({ length: PAGE_SIZE }, fakeJobListItem),
    ...rest,
  };
};
