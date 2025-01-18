import { faker } from '@faker-js/faker';

import { JobListItemSchema } from '@/lib/jobs/core/schemas';

import { fakeJobInfoTags } from '@/lib/jobs/test-utils/fake-job-info-tags';
import { fakeJobProject } from '@/lib/jobs/test-utils/fake-job-project';
import { fakeJobTags } from '@/lib/jobs/test-utils/fake-job-tags';

export const fakeJobListItem = (
  overrides: Partial<JobListItemSchema>,
): JobListItemSchema => {
  const isFeatured = faker.datatype.boolean();
  const endDate = isFeatured ? faker.date.future().getTime() : null;

  const infoTags = fakeJobInfoTags();
  const tags = fakeJobTags();

  return {
    id: faker.string.nanoid(6),
    title: faker.company.catchPhrase(),
    url: faker.internet.url(),
    timestamp: faker.date.recent().getTime(),
    access: faker.helpers.arrayElement(['public', 'protected']),
    infoTags,
    tags,
    promotion: {
      isFeatured,
      endDate,
    },
    organization: faker.datatype.boolean()
      ? {
          name: faker.company.name(),
          website: faker.internet.url(),
          logo: faker.image.url(),
          projects: faker.datatype.boolean()
            ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) })
            : [],
          funding: {
            lastDate: faker.datatype.boolean() ? faker.date.past().toISOString() : null,
            lastAmount: faker.datatype.boolean() ? faker.finance.amount() : null,
          },
        }
      : null,
    project: faker.datatype.boolean() ? fakeJobProject() : null,
    ...overrides,
  };
};
