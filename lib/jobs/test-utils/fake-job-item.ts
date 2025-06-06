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
    href: faker.internet.url(),
    title: faker.company.catchPhrase(),
    applyUrl: faker.internet.url(),
    timestampText: prettyTimestamp(faker.date.recent().getTime()),
    summary: faker.lorem.words(faker.number.int({ min: 10, max: 20 })),
    access: faker.helpers.arrayElement(['public', 'protected']),
    infoTags,
    tags,
    badge: null,
    promotionEndDate: endDate,
    hasGradientBorder: isFeatured,
    isUrgentlyHiring: isFeatured,
    organization: faker.datatype.boolean()
      ? {
          name: faker.company.name(),
          href: faker.internet.url(),
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
