import { ActiveUsersIcon } from '@/lib/shared/ui/svgs/active-users-icon';
import { AuditIcon } from '@/lib/shared/ui/svgs/audit-icon';
import { CategoryIcon } from '@/lib/shared/ui/svgs/category-icon';
import { HackIcon } from '@/lib/shared/ui/svgs/hack-icon';
import { MonthlyVolumeIcon } from '@/lib/shared/ui/svgs/monthly-volume-icon';
import { RevenueIcon } from '@/lib/shared/ui/svgs/revenue-icon';
import { TokenIcon } from '@/lib/shared/ui/svgs/token-icon';
import { TvlIcon } from '@/lib/shared/ui/svgs/tvl-icon';

export const projectInfoTagIcons: Record<string, React.ReactNode> = {
  tokenSymbol: <TokenIcon />,
  category: <CategoryIcon />,
  tvl: <TvlIcon />,
  monthlyVolume: <MonthlyVolumeIcon />,
  monthlyActiveUsers: <ActiveUsersIcon />,
  monthlyFees: <MonthlyVolumeIcon />,
  monthlyRevenue: <RevenueIcon />,
  audit: <AuditIcon />,
  hack: <HackIcon />,
};
