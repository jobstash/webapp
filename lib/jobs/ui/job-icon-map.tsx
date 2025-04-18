import { IconMap } from '@/lib/shared/core/types';
import { JOB_ITEM_BADGE } from '@/lib/jobs/core/constants';

import { AuditIcon } from '@/lib/shared/ui/svgs/audit-icon';
import { BankIcon } from '@/lib/shared/ui/svgs/bank-icon';
import { CategoryIcon } from '@/lib/shared/ui/svgs/category-icon';
import { CommitmentIcon } from '@/lib/shared/ui/svgs/commitment-icon';
import { GlassesIcon } from '@/lib/shared/ui/svgs/glasses-icon';
import { HackIcon } from '@/lib/shared/ui/svgs/hack-icon';
import { LocationIcon } from '@/lib/shared/ui/svgs/location-icon';
import { MonthlyVolumeIcon } from '@/lib/shared/ui/svgs/monthly-volume-icon';
import { PaysInCryptoIcon } from '@/lib/shared/ui/svgs/pays-in-crypto-icon';
import { SalaryIcon } from '@/lib/shared/ui/svgs/salary-icon';
import { SeniorityIcon } from '@/lib/shared/ui/svgs/seniority-icon';
import { TokenAllocationIcon } from '@/lib/shared/ui/svgs/token-allocation-icon';
import { TokenIcon } from '@/lib/shared/ui/svgs/token-icon';
import { TvlIcon } from '@/lib/shared/ui/svgs/tvl-icon';
import { UsersIcon } from '@/lib/shared/ui/svgs/users-icon';
import { WizardHatIcon } from '@/lib/shared/ui/svgs/wizard-hat-icon';
import { WorkModeIcon } from '@/lib/shared/ui/svgs/work-mode-icon';

export const jobInfoTagsIconMap: IconMap = {
  seniority: <SeniorityIcon />,
  salary: <SalaryIcon />,
  location: <LocationIcon />,
  workMode: <WorkModeIcon />,
  commitment: <CommitmentIcon />,
  paysInCrypto: <PaysInCryptoIcon />,
  offersTokenAllocation: <TokenAllocationIcon />,
  category: <CategoryIcon />,
};

export const jobOrgInfoTagsIconMap: IconMap = {
  lastFundingAmount: <SalaryIcon />,
  lastFundingDate: <BankIcon />,
  employees: <UsersIcon />,
};

export const jobProjectInfoTagsIconMap: IconMap = {
  tokenSymbol: <TokenIcon />,
  category: <CategoryIcon />,
  tvl: <TvlIcon />,
  monthlyVolume: <MonthlyVolumeIcon />,
  monthlyActiveUsers: <UsersIcon />,
  monthlyFees: <MonthlyVolumeIcon />,
  monthlyRevenue: <MonthlyVolumeIcon />,
  audit: <AuditIcon />,
  hack: <HackIcon />,
};

type JobBadgeIconMap = Record<
  (typeof JOB_ITEM_BADGE)[keyof typeof JOB_ITEM_BADGE],
  React.ReactNode
>;

export const jobBadgeIconMap: JobBadgeIconMap = {
  [JOB_ITEM_BADGE.FEATURED]: null,
  [JOB_ITEM_BADGE.EXPERT]: <GlassesIcon />,
  [JOB_ITEM_BADGE.BEGINNER]: <WizardHatIcon />,
} as const;
