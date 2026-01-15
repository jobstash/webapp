import { Suspense } from 'react';

import {
  HeroWithPillars,
  PillarItemsBoundary,
  PillarItemsSkeleton,
  HeroSection,
} from '@/features/home/components';

const HomeLayout = ({ children }: Readonly<React.PropsWithChildren>) => {
  return (
    <main className='pb-16'>
      <Suspense fallback={<PillarItemsSkeleton />}>
        <PillarItemsBoundary fallback={<HeroSection />}>
          <HeroWithPillars />
        </PillarItemsBoundary>
      </Suspense>
      <div className='space-y-4 pt-4'>{children}</div>
    </main>
  );
};

export default HomeLayout;
