import { notFound } from 'next/navigation';

import {
  PillarCTA,
  PillarHero,
  PillarJobList,
  PlaceholderAside,
} from '@/features/pillar/components';
import {
  getPillarFilterContext,
  isValidPillarSlug,
} from '@/features/pillar/constants';
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

  if (!isValidPillarSlug(slug)) notFound();

  const pillarContext = getPillarFilterContext(slug);

  const pillarDetails = await fetchPillarDetails({ slug });
  if (!pillarDetails) notFound();

  return (
    <>
      <PillarHero slug={slug} pillarDetails={pillarDetails} />
      <div id='jobs' className='flex scroll-mt-20 gap-4 pt-4 lg:scroll-mt-24'>
        <aside className='sticky top-20 hidden max-h-[calc(100vh-5rem)] w-68 shrink-0 flex-col gap-4 self-start overflow-y-auto lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)]'>
          <PlaceholderAside />
          <PillarCTA slug={slug} pillarContext={pillarContext} />
        </aside>
        <section className='min-w-0 grow'>
          <PillarJobList slug={slug} pillarContext={pillarContext} />
        </section>
      </div>
    </>
  );
};

export default PillarPage;
