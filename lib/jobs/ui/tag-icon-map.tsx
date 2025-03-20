import { CategoryIcon } from '@/lib/shared/ui/svgs/category-icon';
import { CommitmentIcon } from '@/lib/shared/ui/svgs/commitment-icon';
import { LocationIcon } from '@/lib/shared/ui/svgs/location-icon';
import { PaysInCryptoIcon } from '@/lib/shared/ui/svgs/pays-in-crypto-icon';
import { SalaryIcon } from '@/lib/shared/ui/svgs/salary-icon';
import { SeniorityIcon } from '@/lib/shared/ui/svgs/seniority-icon';
import { TokenAllocationIcon } from '@/lib/shared/ui/svgs/token-allocation-icon';
import { WorkModeIcon } from '@/lib/shared/ui/svgs/work-mode-icon';

export const jobInfoTagsMap: Record<string, React.ReactNode> = {
  seniority: <SeniorityIcon />,
  salary: <SalaryIcon />,
  location: <LocationIcon />,
  workMode: <WorkModeIcon />,
  commitment: <CommitmentIcon />,
  paysInCrypto: <PaysInCryptoIcon />,
  offersTokenAllocation: <TokenAllocationIcon />,
  category: <CategoryIcon />,
};

export const jobProjectInfoTagsMap: Record<string, React.ReactNode> = {
  tokenSymbol: null,
  category: null,
};

export const jobProjectTvlTagsMap: Record<string, React.ReactNode> = {
  tvl: null,
  monthlyVolume: null,
  monthlyActiveUsers: null,
  monthlyFees: null,
  monthlyRevenue: null,
};

export const jobProjectAuditTagsMap: Record<string, React.ReactNode> = {
  audit: null,
  hack: null,
};
