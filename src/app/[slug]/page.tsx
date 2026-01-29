import { Metadata } from 'next';
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
import { fetchPillarPageStatic } from '@/features/pillar/server';
import { fetchPillarStaticParams } from '@/features/pillar/server/data';
import { clientEnv } from '@/lib/env/client';

export const generateStaticParams =
  process.env.DISABLE_STATIC_GENERATION === 'true' ||
  process.env.NODE_ENV === 'development'
    ? undefined
    : async () => fetchPillarStaticParams();

interface Props {
  params: Promise<{ slug: string }>;
}

const NOT_FOUND_METADATA: Metadata = { title: 'Page Not Found | JobStash' };

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;

  if (!isValidPillarSlug(slug)) return NOT_FOUND_METADATA;

  const pillarPage = await fetchPillarPageStatic(slug);
  if (!pillarPage) return NOT_FOUND_METADATA;

  const { title: pageTitle, description } = pillarPage;
  const title = `${pageTitle} | JobStash`;
  const url = `${clientEnv.FRONTEND_URL}/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
};

const PillarPage = async ({ params }: Props) => {
  const { slug } = await params;

  if (!isValidPillarSlug(slug)) notFound();

  const pillarPage = await fetchPillarPageStatic(slug);
  if (!pillarPage) notFound();

  const pillarContext = getPillarFilterContext(slug);
  const { title, description, jobs } = pillarPage;

  return (
    <>
      <PillarHero slug={slug} pillarDetails={{ title, description }} />
      <div id='jobs' className='flex scroll-mt-20 gap-4 pt-4 lg:scroll-mt-24'>
        <aside className='sticky top-20 hidden max-h-[calc(100vh-5rem)] w-68 shrink-0 flex-col gap-4 self-start overflow-y-auto lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)]'>
          <PlaceholderAside />
          <PillarCTA slug={slug} pillarContext={pillarContext} />
        </aside>
        <section className='min-w-0 grow'>
          <PillarJobList
            slug={slug}
            pillarContext={pillarContext}
            jobs={jobs}
          />
        </section>
      </div>
    </>
  );
};

export default PillarPage;
