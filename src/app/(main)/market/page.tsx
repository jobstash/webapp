import type { Metadata } from 'next';

import { MarketStateDashboard } from '@/features/job-market/components/market-state-dashboard';
import {
  fetchJobMarketSkillDetail,
  fetchJobMarketSkills,
  fetchJobMarketState,
} from '@/features/job-market/server';
import { clientEnv } from '@/lib/env/client';

type Range = '90' | '365' | 'max';
type Segment = 'remote' | 'local';
type Sort = 'breakout' | 'repricing' | 'salary' | 'demand' | 'cooling';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = {
  title: 'State of the Crypto Job Market',
  description:
    'Explore crypto hiring demand, remote and local compensation, geographic salary differences, and statistically meaningful skill repricing.',
  alternates: { canonical: `${clientEnv.FRONTEND_URL}/market` },
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

  const [state, skills, detail] = await Promise.all([
    fetchJobMarketState(range, classification),
    fetchJobMarketSkills(mode, sort, query),
    skill ? fetchJobMarketSkillDetail(skill, range) : Promise.resolve(null),
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
      detail={detail}
      selection={{ range, classification, mode, sort, query, skill }}
    />
  );
};

export default MarketPage;
