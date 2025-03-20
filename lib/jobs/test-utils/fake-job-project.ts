import { faker } from '@faker-js/faker';

import { MappedInfoTagSchema } from '@/lib/shared/core/schemas';
import { JobListItemProjectSchema } from '@/lib/jobs/core/schemas';

import { formatNumber } from '@/lib/shared/utils/format-number';
import { pluralText } from '@/lib/shared/utils/plural-text';
import { titleCase } from '@/lib/shared/utils/title-case';

const fakeProjectInfoTags = () => {
  const tags: MappedInfoTagSchema[] = [];

  if (faker.datatype.boolean()) {
    tags.push({
      iconKey: 'tokenSymbol',
      label: `Token: $${faker.finance.currencySymbol}`,
    });
  }

  if (faker.datatype.boolean()) {
    tags.push({
      iconKey: 'category',
      label: `Category: ${faker.commerce.department()}`,
    });
  }

  return tags;
};

const fakeProjectTvlTags = () => {
  const tags: MappedInfoTagSchema[] = [];

  if (faker.datatype.boolean()) {
    tags.push({
      iconKey: 'tvl',
      label: `TVL: $${faker.finance.amount()}`,
    });
  }

  if (faker.datatype.boolean()) {
    tags.push({
      iconKey: 'monthlyVolume',
      label: `Monthly Volume: $${formatNumber(faker.number.int({ min: 1_000_000, max: 1_000_000_000 }))}`,
    });
  }

  if (faker.datatype.boolean()) {
    tags.push({
      iconKey: 'monthlyActiveUsers',
      label: `Monthly Active Users: ${formatNumber(faker.number.int({ min: 5000, max: 1_000_000 }))}`,
    });
  }

  if (faker.datatype.boolean()) {
    tags.push({
      iconKey: 'monthlyFees',
      label: `Monthly Fees: $${formatNumber(faker.number.int({ min: 1_000_000, max: 10_000_000 }))}`,
    });
  }

  if (faker.datatype.boolean()) {
    tags.push({
      iconKey: 'monthlyRevenue',
      label: `Monthly Revenue: $${formatNumber(faker.number.int({ min: 1_000_000, max: 1_000_000_000 }))}`,
    });
  }

  return tags;
};

const fakeProjectAudit = () => {
  const hasIssue = faker.datatype.boolean();
  const issueCount = hasIssue ? faker.number.int({ min: 1, max: 10 }) : 0;
  const title = titleCase(faker.lorem.words({ min: 3, max: 5 }));
  const text = `${pluralText('Audit', issueCount)}: ${title}${
    issueCount ? ' (' + issueCount + ` ${pluralText('issue', issueCount)})` : ''
  }`;

  const href = faker.datatype.boolean() ? faker.internet.url() : undefined;

  return {
    iconKey: 'audit',
    label: text,
    href,
  };
};

const fakeProjectHack = () => {
  const title = titleCase(faker.lorem.words({ min: 3, max: 5 }));
  const issueType = faker.helpers.arrayElement([
    'Vulnerability',
    'Exploit',
    'Bug',
    'Rug Pull',
    'Other',
  ]);
  const fundsLost = faker.datatype.boolean()
    ? `($${formatNumber(faker.number.int({ min: 100_000, max: 10_000_000 }))})`
    : '';

  return {
    iconKey: 'hack',
    label: `Hack: ${title} ${issueType} ${fundsLost}`,
  };
};

const fakeProjectAuditTags = () => {
  const tags: MappedInfoTagSchema[] = [];

  const audits = Array.from(
    { length: faker.number.int({ min: 0, max: 5 }) },
    fakeProjectAudit,
  );

  const hacks = Array.from(
    { length: faker.number.int({ min: 0, max: 5 }) },
    fakeProjectHack,
  );

  tags.push(...audits, ...hacks);

  return tags;
};

export const fakeJobProject = (): JobListItemProjectSchema => {
  return {
    name: faker.commerce.productName(),
    website: faker.internet.url(),
    logo: faker.image.url(),
    chains: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
      faker.image.url(),
    ),
    infoTags: [
      ...fakeProjectInfoTags(),
      ...fakeProjectTvlTags(),
      ...fakeProjectAuditTags(),
    ],
  };
};
