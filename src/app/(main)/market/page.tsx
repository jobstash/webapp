import type { Metadata } from 'next';
import Link from 'next/link';

import { MarketStateDashboard } from '@/features/job-market/components/market-state-dashboard';
import { SkillAnalysisDashboard } from '@/features/job-market/components/skill-analysis-dashboard';
import {
  fetchJobMarketSkillDetail,
  fetchJobMarketSkills,
  fetchJobMarketState,
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
  'Explore crypto hiring demand, remote and local compensation, geographic salary differences, and statistically meaningful skill repricing.';
const marketImage = {
  url: '/jobstash-market-analytics-og.png',
  width: 1200,
  height: 630,
  alt: 'JobStash Job Market Analytics — demand, salaries, skills, and geography',
};

export const metadata: Metadata = {
  title: marketTitle,
  description: marketDescription,
  alternates: { canonical: `${clientEnv.FRONTEND_URL}/market` },
  openGraph: {
    type: 'website',
    siteName: 'JobStash',
    title: marketTitle,
    description: marketDescription,
    url: `${clientEnv.FRONTEND_URL}/market`,
    images: [marketImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: marketTitle,
    description: marketDescription,
    images: [marketImage],
  },
};

const first = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? (value[0] ?? '') : (value ?? '');

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

  const [state, skills] = await Promise.all([
    fetchJobMarketState(range, classification),
    fetchJobMarketSkills(mode, sort, query),
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
      skills={skills}
      selection={{ range, classification, mode, sort, query, skill: null }}
    />
  );
};

export default MarketPage;
