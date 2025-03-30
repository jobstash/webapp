import { faker } from '@faker-js/faker';

import { jobSeniorityMapping } from '@/lib/jobs/core/constants';

import { formatNumber } from '@/lib/shared/utils/format-number';

import { jobInfoTagIcons } from '@/lib/jobs/ui/job-info-tag-icons';

const infoTagKeys = Object.keys(jobInfoTagIcons);

const MIN_SALARY = 20_000;
const MAX_SALARY = 200_000;
const SALARY_RANGE_INCREMENT = 20_000;

const MIN_TAG_COUNT = 1;
const MAX_TAG_COUNT = 12;

export const fakeJobInfoTags = () => {
  const selectedKeys = faker.helpers.arrayElements(infoTagKeys, {
    min: MIN_TAG_COUNT,
    max: MAX_TAG_COUNT,
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
      const min = faker.number.int({
        min: MIN_SALARY,
        max: MAX_SALARY - SALARY_RANGE_INCREMENT,
      });
      const max = faker.number.int({
        min: min + SALARY_RANGE_INCREMENT,
        max: MAX_SALARY,
      });
      return `Salary: ${currency} ${formatNumber(min)} - ${formatNumber(max)}`;
    }

    const salary = faker.number.int({ min: MIN_SALARY, max: MAX_SALARY });
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
