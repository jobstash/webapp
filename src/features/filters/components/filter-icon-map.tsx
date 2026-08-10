import {
  BuildingIcon,
  CalendarDaysIcon,
  Clock3Icon,
  CircleDollarSignIcon,
  CodeIcon,
  CodeXmlIcon,
  FunnelIcon,
  FunnelPlusIcon,
  Globe2Icon,
  HandCoinsIcon,
  LinkIcon,
  MapPinIcon,
  SquareChevronRightIcon,
} from 'lucide-react';

import { type IconMap } from '@/lib/types';

import { AuditIcon } from '@/components/svg/audit-icon';
import { BankIcon } from '@/components/svg/bank-icon';
import { CategoryIcon } from '@/components/svg/category-icon';
import { CommitmentIcon } from '@/components/svg/commitment-icon';
import { HackIcon } from '@/components/svg/hack-icon';
import { MonthlyVolumeIcon } from '@/components/svg/monthly-volume-icon';
import { PaysInCryptoIcon } from '@/components/svg/pays-in-crypto-icon';
import { SalaryIcon } from '@/components/svg/salary-icon';
import { SeniorityIcon } from '@/components/svg/seniority-icon';
import { TokenAllocationIcon } from '@/components/svg/token-allocation-icon';
import { TokenIcon } from '@/components/svg/token-icon';
import { TvlIcon } from '@/components/svg/tvl-icon';
import { UsersIcon } from '@/components/svg/users-icon';
import { WizardHatIcon } from '@/components/svg/wizard-hat-icon';
import { WorkModeIcon } from '@/components/svg/work-mode-icon';

export const filterIconMap: IconMap = {
  locations: <WorkModeIcon />,
  workModes: <WorkModeIcon />,
  availability: <MapPinIcon />,
  cities: <MapPinIcon />,
  regions: <MapPinIcon />,
  countries: <Globe2Icon />,
  continents: <Globe2Icon />,
  timezones: <Clock3Icon />,
  seniority: <SeniorityIcon className='size-3' />,
  tags: <CodeXmlIcon className='mt-0.25 size-4' />,
  publicationDate: <CalendarDaysIcon />,
  classifications: <CategoryIcon />,
  commitments: <CommitmentIcon />,
  minSalaryRange: <SalaryIcon />,
  minHeadCount: <UsersIcon />,
  fundingRounds: <BankIcon className='size-3.5' />,
  fundingStages: <BankIcon className='size-3.5' />,
  minCurrentMaintainers: <UsersIcon />,
  minActiveLeads: <UsersIcon />,
  newActiveLeads: <UsersIcon />,
  steppedDownLeads: <UsersIcon />,
  movedLeads: <UsersIcon />,
  earlyLeadDepartures: <UsersIcon />,
  growingTeam: <UsersIcon />,
  shrinkingTeam: <UsersIcon />,
  earlyTeamShrinkage: <UsersIcon />,
  recentlyFunded: <HandCoinsIcon />,
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
  expertJobs: <WizardHatIcon className='mt-0 size-4' />,
  paysInCrypto: <PaysInCryptoIcon />,
  offersTokenAllocation: <TokenAllocationIcon />,
  orderBy: <FunnelPlusIcon className='mt-0.25 size-3.5' />,
  order: <FunnelIcon className='mt-0.25 size-3.5' />,
};
