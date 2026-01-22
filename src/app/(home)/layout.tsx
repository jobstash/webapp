import {
  HeroWithPillars,
  PillarItemsBoundary,
  HeroSection,
} from '@/features/home/components';

const HomeLayout = ({ children }: Readonly<React.PropsWithChildren>) => {
  return (
    <main className='pb-16'>
      <PillarItemsBoundary fallback={<HeroSection />}>
        <HeroWithPillars />
      </PillarItemsBoundary>
      <div className='space-y-4 pt-4'>{children}</div>
    </main>
  );
};

export default HomeLayout;
