import { faker } from '@faker-js/faker';

import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { prettyTimestamp } from '@/lib/shared/utils/pretty-timestamp';

import { fakeJobInfoTags } from '@/lib/jobs/test-utils/fake-job-info-tags';
import { fakeJobProject } from '@/lib/jobs/test-utils/fake-job-project';
import { fakeJobTags } from '@/lib/jobs/test-utils/fake-job-tags';

export const fakeJobItem = () // overrides?: Partial<JobItemSchema>,
: JobItemSchema => {
  const isFeatured = faker.datatype.boolean();
  const endDate = isFeatured ? faker.date.future().getTime() : null;

  const infoTags = fakeJobInfoTags();
  const tags = fakeJobTags();

  return {
    id: faker.string.nanoid(6),
    title: faker.company.catchPhrase(),
    url: faker.internet.url(),
    timestampText: prettyTimestamp(faker.date.recent().getTime()),
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
          location: faker.location.country(),
          logo: faker.image.url(),
          infoTags: [],
        }
      : null,
    projects: Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      fakeJobProject,
    ),
  };
};
