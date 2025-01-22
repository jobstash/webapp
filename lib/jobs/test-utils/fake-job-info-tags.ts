import { faker } from '@faker-js/faker';

import { jobSeniorityMapping } from '@/lib/jobs/core/constants';

import { formatNumber } from '@/lib/shared/utils/format-number';

import { jobInfoTagIcons } from '@/lib/jobs/ui/job-info-tag-icons';

const infoTagKeys = Object.keys(jobInfoTagIcons);

export const fakeJobInfoTags = () => {
  const selectedKeys = faker.helpers.arrayElements(infoTagKeys, {
    min: 1,
    max: infoTagKeys.length,
  });

  return selectedKeys.map((key) => ({
    iconKey: key,
    label: createFakeLabel(key),
  }));
};

const createFakeLabel = (key: string) => {
  if (!key) throw new Error('Empty createFakeLabel key');

  if (key === 'seniority') {
    const options = Object.values(jobSeniorityMapping);
    return faker.helpers.arrayElement(options);
  }

  if (key === 'salary') {
    const currency = faker.finance.currencyCode();
    const isRange = faker.datatype.boolean();
    if (isRange) {
      const min = faker.number.int({ min: 20_000, max: 100_000 });
      const max = faker.number.int({ min: min + 20_000, max: 200_000 });
      return `Salary: ${currency} ${formatNumber(min)} - ${formatNumber(max)}`;
    }

    const salary = faker.number.int({ min: 20_000, max: 200_000 });
    return `Salary: ${currency} ${formatNumber(salary)}`;
  }

  if (key === 'location') {
    return faker.location.country();
  }

  if (key === 'workMode') {
    return faker.helpers.arrayElement(['Remote', 'Onsite', 'Hybrid']);
  }

  if (key === 'commitment') {
    return faker.helpers.arrayElement(['Full Time', 'Part Time', 'Internship']);
  }

  if (key === 'paysInCrypto') return 'Pays In Crypto';

  if (key === 'offersTokenAllocation') return 'Offers Token Allocation';

  if (key === 'classification') {
    return faker.helpers.arrayElement([
      'BIZDEV',
      'DEVREL',
      'DEXES',
      'ENGINEERING',
      'RESEARCH',
      'CUSTOMER_SUPPORT',
      'DESIGN',
      'MARKETING',
      'OPERATIONS',
      'PRODUCT',
      'SALES',
      'LEGAL',
      'FINANCE',
      'HR',
      'ADMIN',
      'MANAGEMENT',
    ]);
  }

  throw new Error(`Unknown createFakeLabel key: ${key}`);
};
