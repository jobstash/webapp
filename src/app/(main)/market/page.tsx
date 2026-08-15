import type { Metadata } from 'next';
import Link from 'next/link';

import { MarketStateDashboard } from '@/features/job-market/components/market-state-dashboard';
import { SkillAnalysisDashboard } from '@/features/job-market/components/skill-analysis-dashboard';
import { withPublishableSkillCompensation } from '@/features/job-market/lib/skill-evidence';
import {
  fetchJobMarketSkillDetail,
  fetchJobMarketSkills,
  fetchJobMarketState,
  fetchJobMarketTopPaying,
  fetchPillarMarket,
} from '@/features/job-market/server';
import { fetchPillarPageStatic } from '@/features/pillar/server';
import { clientEnv } from '@/lib/env/client';

type Range = '90' | '365' | 'max';
type Segment = 'remote' | 'local';
type Sort = 'breakout' | 'repricing' | 'salary' | 'demand' | 'cooling';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const marketTitle = 'State of the Crypto Job Market';
const marketDescription =
  'Explore crypto hiring activity, remote and local compensation, geographic salary differences, and statistically meaningful skill repricing.';
const first = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? (value[0] ?? '') : (value ?? '');

export const generateMetadata = async ({
  searchParams,
}: Props): Promise<Metadata> => {
  const params = await searchParams;
  const classification = first(params.classification) || 'market';
  const range = first(params.range);
  const skill = first(params.skill);
  const rangeKey = range === '90' || range === '365' ? range : 'max';
  const [state, skillMarket] = await Promise.all([
    fetchJobMarketState(rangeKey, classification),
    skill ? fetchPillarMarket(skill, rangeKey) : Promise.resolve(null),
  ]);
  const scopeLabel = state?.selectedClassificationLabel ?? 'Crypto';
  const skillLabel =
    skillMarket?.pillar.label ??
    skill
      .replace(/^t-/, '')
      .replaceAll('-', ' ')
      .replaceAll(/\b\w/g, (letter) => letter.toUpperCase());
  const title = skill
    ? `${skillLabel} skill market`
    : classification === 'market'
      ? marketTitle
      : `${scopeLabel} jobs market`;
  const description = skill
    ? `Open jobs requiring ${skillLabel}, hiring activity, listed compensation, and statistically supported skill-value signals.`
    : classification === 'market'
      ? marketDescription
      : `Open ${scopeLabel.toLowerCase()} jobs, hiring activity, listed compensation, salary geography, and relevant skills.`;
  const canonicalParams = new URLSearchParams();
  if (!skill && classification !== 'market') {
    canonicalParams.set(
      'classification',
      state?.selectedClassification ?? classification,
    );
  }
  if (skill) canonicalParams.set('skill', skill);
  const canonical = `${clientEnv.FRONTEND_URL}/market${
    canonicalParams.size ? `?${canonicalParams.toString()}` : ''
  }`;
  const imageParams = new URLSearchParams({
    classification: state?.selectedClassification ?? classification,
  });
  if (range === '90' || range === '365') imageParams.set('range', range);
  if (skill) imageParams.set('skill', skill);
  const image = {
    url: `${clientEnv.FRONTEND_URL}/market/og?${imageParams.toString()}`,
    width: 1200,
    height: 630,
    alt: `${title} — JobStash market analytics`,
  };
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      siteName: 'JobStash',
      title,
      description,
      url: canonical,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
};

const MarketPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const rawRange = first(params.range);
  const range: Range =
    rawRange === '90' || rawRange === '365' ? rawRange : 'max';
  const classification = first(params.classification) || 'market';
  const mode: Segment = first(params.mode) === 'local' ? 'local' : 'remote';
  const rawSort = first(params.sort);
  const sort: Sort = [
    'breakout',
    'repricing',
    'salary',
    'demand',
    'cooling',
  ].includes(rawSort)
    ? (rawSort as Sort)
    : 'breakout';
  const query = first(params.q).trim();
  const skill = first(params.skill).trim() || null;
  const rawPayRegion = first(params.payRegion).trim();
  const [rawPayRegionType, ...rawPayRegionParts] = rawPayRegion.split(':');
  const rawPayRegionSlug = rawPayRegionParts.join(':');
  const payRegionType = new Set([
    'aggregate',
    'continent',
    'country',
    'region',
    'city',
  ]).has(rawPayRegionType)
    ? rawPayRegionType
    : 'aggregate';
  const payRegionSlug =
    mode === 'local' && payRegionType !== 'aggregate' && rawPayRegionSlug
      ? rawPayRegionSlug
      : 'local';
  const payRegion =
    mode === 'local' ? `${payRegionType}:${payRegionSlug}` : null;

  if (skill) {
    const [detail, market, pillar] = await Promise.all([
      fetchJobMarketSkillDetail(skill, range),
      fetchPillarMarket(skill, range),
      fetchPillarPageStatic(skill).catch(() => null),
    ]);

    if (!detail || !market) {
      return (
        <div className='flex min-h-[60vh] items-center justify-center pb-16 text-center'>
          <div className='max-w-lg rounded-2xl border border-border/60 bg-card/60 p-8'>
            <h1 className='text-3xl font-bold'>Skill analysis is refreshing</h1>
            <p className='mt-3 text-muted-foreground'>
              The selected skill page is temporarily unavailable. Its current
              jobs remain available while the analytical snapshot catches up.
            </p>
            <div className='mt-5 flex flex-wrap justify-center gap-3'>
              <Link
                href={`/${skill}`}
                className='rounded-lg bg-foreground px-4 py-2 text-sm font-bold text-background'
              >
                Browse current jobs
              </Link>
              <Link
                href='/market#skill-explorer'
                className='rounded-lg border border-border px-4 py-2 text-sm font-bold'
              >
                Back to skill rankings
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <SkillAnalysisDashboard
        detail={detail}
        market={market}
        jobs={pillar?.jobs ?? []}
        selection={{ range, mode, skill }}
      />
    );
  }

  const [state, skills, scopeMarket, topPaying] = await Promise.all([
    fetchJobMarketState(range, classification),
    fetchJobMarketSkills(mode, sort, query, classification),
    fetchPillarMarket(classification, range).catch(() => null),
    fetchJobMarketTopPaying(
      mode,
      classification,
      mode === 'local' ? payRegionType : 'remote',
      mode === 'local' ? payRegionSlug : 'remote',
    ),
  ]);

  if (!state || !skills) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center pb-16 text-center'>
        <div className='max-w-lg rounded-2xl border border-border/60 bg-card/60 p-8'>
          <h1 className='text-3xl font-bold'>
            Market intelligence is refreshing
          </h1>
          <p className='mt-3 text-muted-foreground'>
            Jobs remain available while the latest analytical snapshot is being
            prepared. Please try this page again shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MarketStateDashboard
      state={state}
      skills={withPublishableSkillCompensation(skills)}
      scopeMarket={scopeMarket}
      topPaying={topPaying}
      selection={{
        range,
        classification,
        mode,
        sort,
        query,
        skill: null,
        payRegion,
      }}
    />
  );
};

export default MarketPage;
