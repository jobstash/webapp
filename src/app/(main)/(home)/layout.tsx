import { Suspense } from 'react';

import {
  HeroWithPillars,
  PillarItemsBoundary,
  HeroSection,
} from '@/features/home/components';
import {
  JobMarketOverviewSection,
  JobMarketOverviewSkeleton,
} from '@/features/job-market/components';

const HomeLayout = ({ children }: Readonly<React.PropsWithChildren>) => {
  return (
    <div className='pb-16'>
      <PillarItemsBoundary fallback={<HeroSection />}>
        <HeroWithPillars />
      </PillarItemsBoundary>
      <div className='hidden md:block'>
        <Suspense fallback={<JobMarketOverviewSkeleton />}>
          <JobMarketOverviewSection />
        </Suspense>
      </div>
      <div id='jobs' className='scroll-mt-20 space-y-4 pt-4 lg:scroll-mt-24'>
        {children}
      </div>
    </div>
  );
};

export default HomeLayout;
