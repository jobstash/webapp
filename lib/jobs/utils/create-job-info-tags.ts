import 'server-only';

import { MappedInfoTagSchema } from '@/lib/shared/core/schemas';
import { jobSeniorityMapping } from '@/lib/jobs/core/constants';

import { capitalize } from '@/lib/shared/utils/capitalize';
import { formatNumber } from '@/lib/shared/utils/format-number';
import { titleCase } from '@/lib/shared/utils/title-case';

import { JobItemDto } from '@/lib/jobs/server/dtos';

export const createJobInfoTags = (dto: JobItemDto) => {
  const {
    seniority,
    locationType,
    location,
    commitment,
    paysInCrypto,
    offersTokenAllocation,
    classification,
  } = dto;

  const tags: MappedInfoTagSchema[] = [];

  if (seniority && seniority in jobSeniorityMapping) {
    tags.push({
      iconKey: 'seniority',
      label: jobSeniorityMapping[seniority as keyof typeof jobSeniorityMapping],
    });
  }

  const salaryText = getSalaryText(dto);
  if (salaryText) {
    tags.push({
      iconKey: 'salary',
      label: `Salary: ${salaryText}`,
    });
  }

  if (location) {
    tags.push({
      iconKey: 'location',
      label: capitalize(location),
    });
  }

  if (locationType) {
    tags.push({
      iconKey: 'workMode',
      label: capitalize(locationType, true),
    });
  }

  if (commitment) {
    tags.push({
      iconKey: 'commitment',
      label: titleCase(commitment),
    });
  }

  if (paysInCrypto) {
    tags.push({
      iconKey: 'paysInCrypto',
      label: 'Pays in Crypto',
    });
  }

  if (offersTokenAllocation) {
    tags.push({
      iconKey: 'offersTokenAllocation',
      label: 'Token Allocation',
    });
  }

  if (classification) {
    tags.push({
      iconKey: 'category',
      label: titleCase(classification),
    });
  }

  return tags;
};

const getSalaryText = (dto: JobItemDto) => {
  const { minimumSalary, maximumSalary, salary, salaryCurrency } = dto;

  if (minimumSalary && maximumSalary) {
    return `${formatNumber(minimumSalary)} - ${formatNumber(maximumSalary)}`;
  }

  if (salary && salaryCurrency) return `${formatNumber(salary)} ${salaryCurrency}`;

  return null;
};
