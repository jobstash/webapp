import { fetchJobMarketOverview } from '../server';
import { MarketOverviewDashboard } from './market-overview-dashboard';

export const JobMarketOverviewSection = async () => {
  const overview = await fetchJobMarketOverview();
  if (!overview || overview.classifications.length === 0) return null;
  return <MarketOverviewDashboard overview={overview} />;
};
