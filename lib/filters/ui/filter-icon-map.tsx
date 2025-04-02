import {
  BuildingIcon,
  CalendarDaysIcon,
  CircleDollarSignIcon,
  CodeIcon,
  CodeXmlIcon,
  FunnelIcon,
  FunnelPlusIcon,
  HandCoinsIcon,
  LinkIcon,
  SquareChevronRightIcon,
} from 'lucide-react';

import { IconMap } from '@/lib/shared/core/types';

import { AuditIcon } from '@/lib/shared/ui/svgs/audit-icon';
import { BankIcon } from '@/lib/shared/ui/svgs/bank-icon';
import { CategoryIcon } from '@/lib/shared/ui/svgs/category-icon';
import { CommitmentIcon } from '@/lib/shared/ui/svgs/commitment-icon';
import { HackIcon } from '@/lib/shared/ui/svgs/hack-icon';
import { MonthlyVolumeIcon } from '@/lib/shared/ui/svgs/monthly-volume-icon';
import { SalaryIcon } from '@/lib/shared/ui/svgs/salary-icon';
import { SeniorityIcon } from '@/lib/shared/ui/svgs/seniority-icon';
import { TokenIcon } from '@/lib/shared/ui/svgs/token-icon';
import { TvlIcon } from '@/lib/shared/ui/svgs/tvl-icon';
import { UsersIcon } from '@/lib/shared/ui/svgs/users-icon';
import { WorkModeIcon } from '@/lib/shared/ui/svgs/work-mode-icon';

/** Icon map for the filters. Range filters use min paramkey. */
export const filterIconMap: IconMap = {
  locations: <WorkModeIcon />,
  seniority: <SeniorityIcon className='size-3 md:mt-0.75' />,
  tags: <CodeXmlIcon className='mt-0.25 size-4' />,
  publicationDate: <CalendarDaysIcon />,
  classifications: <CategoryIcon />,
  commitments: <CommitmentIcon />,
  minSalaryRange: <SalaryIcon />,
  minHeadCount: <UsersIcon />,
  fundingRounds: <BankIcon className='size-3.5' />,
  investors: <HandCoinsIcon />,
  audits: <AuditIcon />,
  hacks: <HackIcon />,
  chains: <LinkIcon />,
  organizations: <BuildingIcon className='mt-0.25 size-3.5' />,
  projects: <SquareChevronRightIcon />,
  minTvl: <TvlIcon />,
  minMonthlyVolume: <MonthlyVolumeIcon />,
  minMonthlyFees: <CircleDollarSignIcon />,
  minMonthlyRevenue: <MonthlyVolumeIcon />,
  token: <TokenIcon />,
  onboardIntoWeb3: <CodeIcon />,
  orderBy: <FunnelPlusIcon className='mt-0.25 size-3.5' />,
  order: <FunnelIcon className='mt-0.25 size-3.5' />,
};
