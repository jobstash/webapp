import { ImageResponse } from 'next/og';

import type { DeveloperReport } from '../schemas';

const compact = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);

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

export const renderDeveloperReportOg = (
  report: DeveloperReport | null,
  label: string,
) => {
  const current = report?.current;
  const points = sparkline(
    report?.history.slice(-36).map((point) => point.activePeople) ?? [],
  );
  const established = current?.establishedPeople ?? 0;

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
          'radial-gradient(circle at 84% 15%, rgba(96, 165, 250, .2), transparent 35%), radial-gradient(circle at 12% 100%, rgba(52, 211, 153, .2), transparent 38%), linear-gradient(135deg, #070908, #101613)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            width: 940,
          }}
        >
          <div
            style={{
              color: '#6ee7b7',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            JobStash × Ecosystem Vision
          </div>
          <div
            style={{
              maxWidth: 940,
              marginTop: 18,
              fontSize: 64,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            {label} Developer Report
          </div>
          <div style={{ marginTop: 14, color: '#a4ada8', fontSize: 25 }}>
            Internal people, maintainers, leads, tenure, and chain activity
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 76,
            height: 76,
            border: '2px solid #34d399',
            borderRadius: 38,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              border: '7px solid #6ee7b7',
              borderRadius: 28,
            }}
          />
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
        {points ? (
          <g>
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
          </g>
        ) : null}
      </svg>

      <div style={{ display: 'flex', gap: 56 }}>
        {[
          ['Internal people', compact(current?.activePeople ?? 0)],
          ['Maintainers', compact(current?.activeMaintainers ?? 0)],
          ['Established', compact(established)],
          ['Organizations', compact(current?.activeOrganizations ?? 0)],
          ['Repositories', compact(report?.totals.repositoryCount ?? 0)],
        ].map(([metricLabel, value]) => (
          <div
            key={metricLabel}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ color: '#94a39b', fontSize: 18 }}>{metricLabel}</div>
            <div style={{ marginTop: 7, fontSize: 34, fontWeight: 800 }}>
              {value}
            </div>
          </div>
        ))}
      </div>
      <div style={{ color: '#7f8d85', display: 'flex', fontSize: 17 }}>
        {`Verified internal contributors only · External contributors excluded · Complete through ${report?.completeThrough ?? 'latest snapshot'}`}
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
};
