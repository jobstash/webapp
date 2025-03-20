import 'server-only';

import { FundingRoundDto } from '@/lib/shared/core/dtos';

import { formatNumber } from './format-number';
import { shortTimestamp } from './short-timestamp';

export const getOrgFundingInfo = (fundingRounds: FundingRoundDto[] = []) => {
  let lastFundingAmount = null;
  let lastFundingDate = null;

  if (fundingRounds.length > 0) {
    for (const fundingRound of fundingRounds) {
      if (fundingRound.date && fundingRound.date > (lastFundingDate ?? 0)) {
        lastFundingDate = fundingRound.date;
        lastFundingAmount = fundingRound.raisedAmount ?? 0;
      }
    }
  }

  return {
    lastDate: lastFundingDate ? `${shortTimestamp(lastFundingDate)}` : null,
    lastAmount: lastFundingAmount
      ? `${formatNumber(lastFundingAmount * 1_000_000)}`
      : null,
  };
};
