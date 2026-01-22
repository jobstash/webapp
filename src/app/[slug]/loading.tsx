import { PillarHeroSkeleton } from '@/features/pillar/components';

const PillarLoading = () => {
  return (
    <main className='pb-16'>
      <PillarHeroSkeleton />
      <div className='space-y-4 pt-4'>
        {/* Job list skeleton will go here */}
      </div>
    </main>
  );
};

export default PillarLoading;
