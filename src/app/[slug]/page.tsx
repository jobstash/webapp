import { notFound } from 'next/navigation';

import { PillarHero } from '@/features/pillar/components';
import { fetchPillarDetails } from '@/features/pillar/server';
import { fetchPillarStaticParams } from '@/features/pillar/server/data';

export const generateStaticParams = async () => {
  if (process.env.DISABLE_STATIC_GENERATION === 'true') return [];
  return fetchPillarStaticParams();
};

interface Props {
  params: Promise<{ slug: string }>;
}

const PillarPage = async ({ params }: Props) => {
  const { slug } = await params;
  const pillarDetails = await fetchPillarDetails({ slug });

  if (!pillarDetails) notFound();

  return (
    <main className='pb-16'>
      <PillarHero slug={slug} pillarDetails={pillarDetails} />
      <div id='jobs' className='space-y-4 pt-4'>
        {/* Job list will be added here */}
      </div>
    </main>
  );
};

export default PillarPage;
