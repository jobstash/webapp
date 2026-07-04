import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FiltersAside } from '@/features/filters/components/filters-aside';
import {
  OrgAboutSection,
  PillarHero,
  PillarJobList,
  SuggestedPillars,
} from '@/features/pillar/components';
import {
  PILLAR_MIN_INDEXABLE_JOBS,
  getPillarCategory,
  getPillarFilterContext,
  isValidPillarSlug,
} from '@/features/pillar/constants';
import { fetchPillarPageStatic } from '@/features/pillar/server';
import { fetchPillarStaticParams } from '@/features/pillar/server/data';
import { clientEnv } from '@/lib/env/client';
import { robotsNoindexFollow } from '@/lib/seo';

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

  // Thin pillars (junk/low-volume tags) stay usable for humans but are
  // kept out of the index; no canonical alongside noindex.
  const isThin = pillarPage.jobs.length < PILLAR_MIN_INDEXABLE_JOBS;

  return {
    title,
    description,
    ...(isThin
      ? { robots: robotsNoindexFollow() }
      : { alternates: { canonical: url } }),
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
  const { title, description, jobs, suggestedPillars } = pillarPage;

  // Org pillars show the org's real copy instead of the generated pillar
  // descriptor. Prefer MW's dedicated org object (works with 0 jobs), fall
  // back to the org carried on any listed job.
  const org =
    getPillarCategory(slug) === 'organization'
      ? (pillarPage.organization ??
        jobs.find((job) => job.organization)?.organization ??
        null)
      : null;
  const heroDescription = org?.summary ?? description;
  const orgDescription =
    org?.description && org.description !== org.summary
      ? org.description
      : null;

  return (
    <>
      <PillarHero
        slug={slug}
        pillarDetails={{ title, description: heroDescription }}
      />
      {org && orgDescription && (
        <OrgAboutSection name={org.name} description={orgDescription} />
      )}
      <div id='jobs' className='flex scroll-mt-20 gap-4 pt-4 lg:scroll-mt-24'>
        <aside className='sticky top-20 hidden max-h-[calc(100vh-5rem)] w-68 shrink-0 flex-col gap-4 self-start overflow-y-auto lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)]'>
          <FiltersAside pillarMode pillarContext={pillarContext} />
          <SuggestedPillars items={suggestedPillars} />
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
