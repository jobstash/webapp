import { JobList } from '@/features/jobs/components/job-list/job-list';
import { getApiSlug } from '@/features/pillar/constants';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import {
  FiltersAside,
  FiltersDrawer,
} from '@/features/filters/components/filters-aside';
import { OrgInfoCard } from '@/features/jobs/components/job-details/org-info-card';
import { PillarMarketSection } from '@/features/job-market/components';
import { fetchPillarMarket } from '@/features/job-market/server';
import {
  OrgAboutSection,
  PillarHero,
  SuggestedPillars,
} from '@/features/pillar/components';
import {
  getPillarCategory,
  getPillarFilterContext,
  isPillarIndexable,
  isValidPillarSlug,
} from '@/features/pillar/constants';
import { fetchPillarPageStatic } from '@/features/pillar/server';
import { fetchPillarStaticParams } from '@/features/pillar/server/data';
import { fetchCanonicalPillarSlug } from '@/features/pillar/server/data/fetch-canonical-pillar-slug';
import { clientEnv } from '@/lib/env/client';
import { robotsNoindexFollow } from '@/lib/seo';

export const generateStaticParams =
  process.env.DISABLE_STATIC_GENERATION === 'true' ||
  process.env.NODE_ENV === 'development'
    ? undefined
    : async () => fetchPillarStaticParams();

// Route-level revalidation bounds every cached state of this page — including
// notFound() results — so pillar job sets follow ongoing imports within five
// minutes instead of retaining an hour-old prerender.
export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string> & { page?: string }>;
}

const NOT_FOUND_METADATA: Metadata = { title: 'Page Not Found' };

export const generateMetadata = async ({
  params,
  searchParams,
}: Props): Promise<Metadata> => {
  const { slug } = await params;

  if (!isValidPillarSlug(slug)) return NOT_FOUND_METADATA;

  const pillarPage = await fetchPillarPageStatic(slug);
  if (!pillarPage) return NOT_FOUND_METADATA;

  const { title, description } = pillarPage;
  const url = `${clientEnv.FRONTEND_URL}/${slug}`;

  // Middleware owns canonical indexability, including known zero-inventory
  // classifications such as FDE. Keep the count fallback only for a rolling
  // deploy where an older middleware payload has no explicit decision.
  const isNoindex =
    Object.keys(await searchParams).length > 0 ||
    pillarPage.indexing === 'noindex' ||
    (pillarPage.indexing === undefined &&
      !isPillarIndexable(pillarPage.jobs.length));

  // og/twitter titles inherit the templated page title when unset.
  return {
    title,
    description,
    ...(isNoindex
      ? { robots: robotsNoindexFollow() }
      : { alternates: { canonical: url } }),
    openGraph: {
      description,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      description,
    },
  };
};

const PillarPage = async ({ params, searchParams }: Props) => {
  const query = await searchParams;
  const { page, ...filters } = query;
  const currentPage = Math.max(1, Math.trunc(Number(page) || 1));
  const { slug } = await params;

  if (!isValidPillarSlug(slug)) notFound();

  const canonicalSlug = await fetchCanonicalPillarSlug(slug);
  if (canonicalSlug) {
    const qs = new URLSearchParams(query).toString();
    permanentRedirect(`/${canonicalSlug}${qs ? `?${qs}` : ''}`);
  }

  const [pillarPage, pillarMarket] = await Promise.all([
    fetchPillarPageStatic(slug),
    fetchPillarMarket(slug),
  ]);
  if (!pillarPage) notFound();

  const pillarContext =
    pillarPage.filterContext ?? getPillarFilterContext(slug);
  const feedFilters = {
    ...(getPillarCategory(slug) === 'organization'
      ? {}
      : { publicationDate: 'past-3-months' }),
    ...filters,
  };
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
      {pillarMarket && <PillarMarketSection market={pillarMarket} />}
      {/* Below lg the aside is hidden — surface the org card under the hero */}
      {org && (
        <div className='mx-auto w-full max-w-2xl px-4 pt-6 lg:hidden'>
          <OrgInfoCard organization={org} hideJobsButton />
        </div>
      )}
      {org && orgDescription && (
        <OrgAboutSection name={org.name} description={orgDescription} />
      )}
      <div id='jobs' className='flex scroll-mt-20 gap-4 pt-4 lg:scroll-mt-24'>
        {/* Normal flow, natural height — a viewport-capped column gives the
            filter block its own scrollbar once the org card is present */}
        <aside className='hidden w-68 shrink-0 flex-col gap-4 self-start lg:flex'>
          {org && <OrgInfoCard organization={org} hideJobsButton />}
          <FiltersAside pillarMode pillarContext={pillarContext} />
          <SuggestedPillars items={suggestedPillars} />
        </aside>
        <section className='min-w-0 grow'>
          <JobList
            pillarSlug={getApiSlug(slug)}
            basePath={`/${slug}`}
            currentPage={currentPage}
            searchParams={feedFilters}
            mobileFilters={
              <FiltersDrawer pillarMode pillarContext={pillarContext} />
            }
          />
        </section>
      </div>
    </>
  );
};

export default PillarPage;
