// oxlint-disable no-img-element
import { ImageResponse } from 'next/og';

import { fetchJobMarketOverview } from '@/features/job-market/server';
import { clientEnv } from '@/lib/env/client';

export const runtime = 'nodejs';

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export const GET = async () => {
  const overview = await fetchJobMarketOverview();
  const metrics = overview
    ? [
        ['Open roles', formatNumber(overview.market.current.activeJobs)],
        [
          'Hiring companies',
          formatNumber(overview.market.current.hiringCompanies),
        ],
        [
          'Added this week',
          formatNumber(overview.market.activity.newPostings.current),
        ],
      ]
    : [];

  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        color: '#f7f7f8',
        background:
          'radial-gradient(circle at 88% 18%, rgba(124, 58, 237, .32), transparent 34%), radial-gradient(circle at 12% 100%, rgba(217, 151, 45, .22), transparent 38%), linear-gradient(135deg, #070708, #111015 62%, #0c0b10)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -160,
          right: -70,
          display: 'flex',
          width: 500,
          height: 500,
          border: '1px solid rgba(167, 139, 250, .2)',
          borderRadius: 250,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -95,
          right: 0,
          display: 'flex',
          width: 365,
          height: 365,
          border: '1px solid rgba(217, 151, 45, .18)',
          borderRadius: 190,
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '52px 64px 48px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <img
              src={`${clientEnv.FRONTEND_URL}/jobstash-logo.png`}
              alt='JobStash'
              width={72}
              height={72}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  letterSpacing: -1,
                }}
              >
                JobStash
              </div>
              <div
                style={{
                  marginTop: 3,
                  color: '#a8a6ae',
                  fontSize: 17,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                }}
              >
                Jobs + market intelligence
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 18px',
              border: '1px solid rgba(255,255,255,.14)',
              borderRadius: 24,
              color: '#d5d2db',
              backgroundColor: 'rgba(20, 19, 24, .72)',
              fontSize: 18,
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: 9,
                backgroundColor: '#6ee7b7',
              }}
            />
            Updated daily
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              color: '#a9a6af',
              fontSize: 31,
              fontWeight: 600,
              letterSpacing: -0.5,
            }}
          >
            Find your next
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 4,
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.03,
              letterSpacing: -2.8,
            }}
          >
            <span style={{ color: '#d5a15a' }}>Crypto,</span>
            <span style={{ marginLeft: 16, color: '#b98ad8' }}>AI</span>
            <span style={{ marginLeft: 16, color: '#ddd9e2' }}>or</span>
            <span style={{ marginLeft: 16, color: '#8b6bf5' }}>Fintech</span>
            <span style={{ marginLeft: 16, color: '#f7f7f8' }}>role</span>
          </div>
          <div
            style={{
              display: 'flex',
              maxWidth: 930,
              marginTop: 20,
              color: '#b8b5bd',
              fontSize: 25,
              lineHeight: 1.35,
            }}
          >
            Data-rich opportunities across crypto, AI, robotics and fintech —
            built for informed career decisions.
          </div>
        </div>

        {metrics.length > 0 ? (
          <div style={{ display: 'flex', gap: 16 }}>
            {metrics.map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: 250,
                  padding: '14px 18px',
                  border: '1px solid rgba(255,255,255,.12)',
                  borderRadius: 14,
                  backgroundColor: 'rgba(20, 19, 24, .78)',
                }}
              >
                <span style={{ color: '#99969f', fontSize: 17 }}>{label}</span>
                <span style={{ fontSize: 27, fontWeight: 800 }}>{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              color: '#99969f',
              fontSize: 20,
              letterSpacing: 0.4,
            }}
          >
            Search jobs · Compare employers · Understand the market
          </div>
        )}
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
};
