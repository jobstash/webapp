import {
  BriefcaseIcon,
  Building2Icon,
  CalendarIcon,
  ClockIcon,
  CoinsIcon,
  DollarSignIcon,
  ExternalLinkIcon,
  FlameIcon,
  FolderClosedIcon,
  LandmarkIcon,
  LaptopIcon,
  MapPinIcon,
  UsersIcon,
  UserStarIcon,
  WalletIcon,
} from 'lucide-react';

interface InfoTagIconProps {
  iconKey: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  posted: ClockIcon,
  urgentlyHiring: FlameIcon,
  seniority: UserStarIcon,
  salary: DollarSignIcon,
  location: MapPinIcon,
  orgLocation: LandmarkIcon,
  workMode: LaptopIcon,
  commitment: CalendarIcon,
  paysInCrypto: WalletIcon,
  offersTokenAllocation: CoinsIcon,
  category: FolderClosedIcon,
  lastFundingAmount: DollarSignIcon,
  lastFundingDate: CalendarIcon,
  employees: UsersIcon,
  organization: BriefcaseIcon,
  externalLink: ExternalLinkIcon,
};

export const InfoTagIcon = ({ iconKey }: InfoTagIconProps) => {
  const Icon = ICON_MAP[iconKey] ?? Building2Icon;
  return <Icon className='size-3.5' aria-hidden='true' />;
};
