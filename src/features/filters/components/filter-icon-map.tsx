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

import { type IconMap } from '@/lib/types';

import { AuditIcon } from '@/components/svg/audit-icon';
import { BankIcon } from '@/components/svg/bank-icon';
import { CategoryIcon } from '@/components/svg/category-icon';
import { CommitmentIcon } from '@/components/svg/commitment-icon';
import { HackIcon } from '@/components/svg/hack-icon';
import { MonthlyVolumeIcon } from '@/components/svg/monthly-volume-icon';
import { SalaryIcon } from '@/components/svg/salary-icon';
import { SeniorityIcon } from '@/components/svg/seniority-icon';
import { TokenIcon } from '@/components/svg/token-icon';
import { TvlIcon } from '@/components/svg/tvl-icon';
import { UsersIcon } from '@/components/svg/users-icon';
import { WorkModeIcon } from '@/components/svg/work-mode-icon';

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
