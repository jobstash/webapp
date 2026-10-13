import { fetchPillarItems } from '@/features/home/server';
import { HeroSection } from '@/features/home/components/hero-section';
import { fetchFilterConfigs } from '@/features/filters/server';

export const HeroWithPillars = async () => {
  const [pillarItems, filterConfigs] = await Promise.all([
    fetchPillarItems(),
    fetchFilterConfigs(),
  ]);
  const organizationClassificationFilter = filterConfigs.find(
    (config) =>
      'paramKey' in config &&
      config.paramKey === 'organizationClassifications' &&
      'options' in config,
  );

  return (
    <HeroSection
      pillarItems={pillarItems}
      organizationClassificationFilter={
        organizationClassificationFilter &&
        'options' in organizationClassificationFilter
          ? organizationClassificationFilter
          : undefined
      }
    />
  );
};

// Keep PillarItems as alias for backward compatibility
export const PillarItems = HeroWithPillars;
