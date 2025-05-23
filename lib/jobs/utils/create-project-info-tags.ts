import { ProjectAllInfoDto } from '@/lib/shared/core/dtos';
import { MappedInfoTagSchema } from '@/lib/shared/core/schemas';

import { formatNumber } from '@/lib/shared/utils/format-number';
import { pluralText } from '@/lib/shared/utils/plural-text';

const createInfoTags = (dto: ProjectAllInfoDto) => {
  const { tokenSymbol, category } = dto;

  const tags: MappedInfoTagSchema[] = [];

  if (tokenSymbol) {
    tags.push({
      iconKey: 'tokenSymbol',
      label: `Token: $${tokenSymbol}`,
    });
  }

  if (category) {
    tags.push({
      iconKey: 'category',
      label: `Category: ${category}`,
    });
  }

  return tags;
};

const createTvlTags = (dto: ProjectAllInfoDto) => {
  const { tvl, monthlyVolume, monthlyActiveUsers, monthlyFees, monthlyRevenue } = dto;

  const tags: MappedInfoTagSchema[] = [];

  if (tvl) {
    tags.push({
      iconKey: 'tvl',
      label: `TVL: $${formatNumber(tvl)}`,
    });
  }

  if (monthlyVolume) {
    tags.push({
      iconKey: 'monthlyVolume',
      label: `Monthly Volume: $${formatNumber(monthlyVolume)}`,
    });
  }

  if (monthlyActiveUsers) {
    tags.push({
      iconKey: 'monthlyActiveUsers',
      label: `Monthly Active Users: ${formatNumber(monthlyActiveUsers)}`,
    });
  }

  if (monthlyFees) {
    tags.push({
      iconKey: 'monthlyFees',
      label: `Monthly Fees: $${formatNumber(monthlyFees)}`,
    });
  }

  if (monthlyRevenue) {
    tags.push({
      iconKey: 'monthlyRevenue',
      label: `Monthly Revenue: $${formatNumber(monthlyRevenue)}`,
    });
  }

  return tags;
};

const createAuditTags = (dto: ProjectAllInfoDto) => {
  const { hacks, audits } = dto;

  const tags: MappedInfoTagSchema[] = [];

  if (audits.length > 0) {
    for (const audit of audits) {
      const issueCount = audit.techIssues ?? 0;
      const title = audit.name;
      const text = `${pluralText('Audit', issueCount)}: ${title}${
        issueCount ? ' (' + issueCount + ` ${pluralText('issue', issueCount)})` : ''
      }`;
      tags.push({
        iconKey: 'audit',
        label: text,
        href: audit.link || undefined,
      });
    }
  }

  if (hacks.length > 0) {
    for (const hack of hacks) {
      const title = hack.category && hack.category !== 'Other' ? hack.category : '';
      const issueType = hack.issueType ?? 'Other';
      const fundsLost = hack.fundsLost ? `($${formatNumber(hack.fundsLost)})` : '';
      tags.push({
        iconKey: 'hack',
        label: `Hack: ${title} ${issueType} ${fundsLost}`,
      });
    }
  }

  return tags;
};

export const createProjectInfoTags = (dto: ProjectAllInfoDto) => {
  return [...createInfoTags(dto), ...createTvlTags(dto), ...createAuditTags(dto)];
};
