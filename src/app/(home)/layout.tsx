import {
  HeroWithPillars,
  PillarItemsBoundary,
  HeroSection,
} from '@/features/home/components';

const HomeLayout = ({ children }: Readonly<React.PropsWithChildren>) => {
  return (
    <div className='pb-16'>
      <PillarItemsBoundary fallback={<HeroSection />}>
        <HeroWithPillars />
      </PillarItemsBoundary>
      <div id='jobs' className='scroll-mt-20 space-y-4 pt-4 lg:scroll-mt-24'>
        {children}
      </div>
    </div>
  );
};

export default HomeLayout;
