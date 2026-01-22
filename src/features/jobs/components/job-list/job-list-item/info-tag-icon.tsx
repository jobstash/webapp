import {
  BriefcaseIcon,
  Building2Icon,
  CalendarIcon,
  ClockIcon,
  CoinsIcon,
  DollarSignIcon,
  GlobeIcon,
  MapPinIcon,
  TagIcon,
  UsersIcon,
  UserStarIcon,
  WalletIcon,
} from 'lucide-react';

interface InfoTagIconProps {
  iconKey: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  posted: ClockIcon,
  seniority: UserStarIcon,
  salary: DollarSignIcon,
  location: MapPinIcon,
  workMode: GlobeIcon,
  commitment: CalendarIcon,
  paysInCrypto: WalletIcon,
  offersTokenAllocation: CoinsIcon,
  category: TagIcon,
  lastFundingAmount: DollarSignIcon,
  lastFundingDate: CalendarIcon,
  employees: UsersIcon,
  organization: BriefcaseIcon,
};

export const InfoTagIcon = ({ iconKey }: InfoTagIconProps) => {
  const Icon = ICON_MAP[iconKey] ?? Building2Icon;
  return <Icon className='size-3.5' aria-hidden='true' />;
};
