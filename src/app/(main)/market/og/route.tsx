import { ImageResponse } from 'next/og';

import {
  fetchJobMarketState,
  fetchPillarMarket,
} from '@/features/job-market/server';

export const runtime = 'nodejs';

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);

const formatChange = (value: number | null) =>
  value === null
    ? 'Building history'
    : `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

const sparkline = (values: number[]) => {
  if (values.length < 2) return '';
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const spread = Math.max(1, maximum - minimum);
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 1040 + 20;
      const y = 150 - ((value - minimum) / spread) * 120 + 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
};

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const classification = url.searchParams.get('classification') || 'market';
  const skill = url.searchParams.get('skill');
  const range = url.searchParams.get('range');
  const rangeKey = range === '90' || range === '365' ? range : 'max';
  const [state, history] = await Promise.all([
    fetchJobMarketState(rangeKey, classification),
    fetchPillarMarket(skill || classification, rangeKey),
  ]);
  const selected =
    state?.selectedClassification === 'market'
      ? state.market
      : state?.classifications.find(
          (ticker) => ticker.slug === state.selectedClassification,
        );
  const label = skill
    ? (history?.pillar.label ?? skill.replace(/^t-/, '').replaceAll('-', ' '))
    : (state?.selectedClassificationLabel ?? 'Crypto');
  const scoped = state?.selectedClassification !== 'market';
  const title = skill
    ? `${label} skill market`
    : scoped
      ? `${label} jobs market`
      : 'State of the Crypto Job Market';
  const points = sparkline(
    history?.history.slice(-24).map((point) => point.activeJobs) ?? [],
  );

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '58px 64px',
        color: '#f5f5f5',
        background:
          'radial-gradient(circle at 82% 12%, rgba(52, 211, 153, .23), transparent 36%), linear-gradient(135deg, #070908, #101613)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#6ee7b7',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            JobStash market analytics
          </div>
          <div
            style={{
              maxWidth: 910,
              marginTop: 18,
              fontSize: 64,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            border: '2px solid #34d399',
            borderRadius: 18,
            color: '#6ee7b7',
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          JS
        </div>
      </div>

      <svg width='1080' height='170' viewBox='0 0 1080 170'>
        <line
          x1='20'
          y1='150'
          x2='1060'
          y2='150'
          stroke='#25352d'
          strokeWidth='2'
        />
        {points && (
          <>
            <polyline
              points={points}
              fill='none'
              stroke='#34d399'
              strokeWidth='8'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <polyline
              points={points}
              fill='none'
              stroke='#a7f3d0'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </>
        )}
      </svg>

      <div style={{ display: 'flex', gap: 70 }}>
        {(skill
          ? [
              ['Open jobs', formatNumber(history?.current.activeJobs ?? 0)],
              [
                'Hiring employers',
                formatNumber(history?.current.hiringCompanies ?? 0),
              ],
              [
                'New postings · 7d',
                formatNumber(history?.momentum.currentJobs ?? 0),
              ],
              [
                'Posting change',
                formatChange(history?.momentum.percentChange ?? null),
              ],
            ]
          : [
              ['Open jobs', formatNumber(selected?.current.activeJobs ?? 0)],
              [
                'Hiring employers',
                formatNumber(selected?.current.hiringCompanies ?? 0),
              ],
              [
                'New postings · 7d',
                formatNumber(selected?.activity.newPostings.current ?? 0),
              ],
              [
                'Open-job change',
                formatChange(
                  selected?.activity.openInventory.percentChange ?? null,
                ),
              ],
            ]
        ).map(([metric, value]) => (
          <div
            key={metric}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ color: '#94a39b', fontSize: 20 }}>{metric}</div>
            <div style={{ marginTop: 7, fontSize: 38, fontWeight: 800 }}>
              {value}
            </div>
          </div>
        ))}
      </div>
      <div style={{ color: '#7f8d85', fontSize: 17 }}>
        Open roles are actionable. Compensation analysis also uses the
        historical offline corpus. Complete through{' '}
        {state?.completeThrough ?? 'latest snapshot'}.
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
};
