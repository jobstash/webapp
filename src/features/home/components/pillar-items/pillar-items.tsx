import { fetchPillarItems } from '@/features/home/server';
import { HeroSection } from '@/features/home/components/hero-section';

export const HeroWithPillars = async () => {
  const pillarItems = await fetchPillarItems();

  return <HeroSection pillarItems={pillarItems} />;
};

// Keep PillarItems as alias for backward compatibility
export const PillarItems = HeroWithPillars;
