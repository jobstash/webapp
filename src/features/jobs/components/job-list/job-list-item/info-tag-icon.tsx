import {
  Briefcase,
  Building2,
  Calendar,
  Coins,
  DollarSign,
  Globe,
  MapPin,
  Tag,
  Users,
  Wallet,
} from 'lucide-react';

interface InfoTagIconProps {
  iconKey: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  seniority: Briefcase,
  salary: DollarSign,
  location: MapPin,
  workMode: Globe,
  commitment: Calendar,
  paysInCrypto: Wallet,
  offersTokenAllocation: Coins,
  category: Tag,
  lastFundingAmount: DollarSign,
  lastFundingDate: Calendar,
  employees: Users,
};

export const InfoTagIcon = ({ iconKey }: InfoTagIconProps) => {
  const Icon = ICON_MAP[iconKey] ?? Building2;
  return <Icon className='size-3' />;
};
