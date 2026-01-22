import { notFound, redirect } from 'next/navigation';

import { SocialsAside } from '@/components/socials-aside';
import { FiltersAside } from '@/features/filters/components/filters-aside';
import { JobList } from '@/features/jobs/components/job-list/job-list';
import { PillarHero } from '@/features/pillar/components';
import { getPillarFilterContext } from '@/features/pillar/constants';
import {
  fetchPillarDetails,
  getCleanPillarSearchParams,
} from '@/features/pillar/server';
import { fetchPillarStaticParams } from '@/features/pillar/server/data';

export const generateStaticParams = async () => {
  if (process.env.DISABLE_STATIC_GENERATION === 'true') return [];
  return fetchPillarStaticParams();
};

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const normalizeSearchParams = (
  params: Record<string, string | string[] | undefined>,
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      result[key] = Array.isArray(value) ? value[0] : value;
    }
  }
  return result;
};

const PillarPage = async ({ params, searchParams }: Props) => {
  const [{ slug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  // Redirect if URL contains redundant pillar values
  const pillarContext = getPillarFilterContext(slug);
  if (pillarContext) {
    const { needsRedirect, cleanParams } = getCleanPillarSearchParams(
      resolvedSearchParams,
      pillarContext,
    );
    if (needsRedirect) {
      const cleanUrl = cleanParams.toString()
        ? `/${slug}?${cleanParams.toString()}`
        : `/${slug}`;
      redirect(cleanUrl);
    }
  }

  const pillarDetails = await fetchPillarDetails({ slug });

  if (!pillarDetails) notFound();

  const normalizedParams = normalizeSearchParams(resolvedSearchParams);
  const { page, ...restSearchParams } = normalizedParams;
  const currentPage = Number(page) || 1;

  return (
    <>
      <PillarHero slug={slug} pillarDetails={pillarDetails} />
      <div className='flex gap-4 pt-4'>
        <aside className='sticky top-20 hidden max-h-[calc(100vh-5rem)] w-68 shrink-0 flex-col gap-4 self-start overflow-y-auto lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)]'>
          <FiltersAside pillarContext={pillarContext} />
          <SocialsAside />
        </aside>
        <section className='min-w-0 grow'>
          <JobList
            currentPage={currentPage}
            searchParams={restSearchParams}
            pillarContext={pillarContext ?? undefined}
          />
        </section>
      </div>
    </>
  );
};

export default PillarPage;
