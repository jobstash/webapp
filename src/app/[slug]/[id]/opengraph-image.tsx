// oxlint-disable no-img-element
import { ImageResponse } from 'next/og';

import {
  extractOgImageData,
  OG_IMAGE_SIZE,
} from '@/features/jobs/lib/og-image-utils';
import { fetchJobDetails } from '@/features/jobs/server/data';
import { clientEnv } from '@/lib/env/client';

export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';
export const alt = 'Job listing on JobStash';

interface Props {
  params: Promise<{ id: string }>;
}

const COLORS = {
  background: '#121212',
  surface: '#1E1E1E',
  border: '#2A2A2A',
  text: '#FFFFFF',
  textMuted: '#9CA3AF',
  pillText: '#E5E7EB',
} as const;

const JobNotFoundImage = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: COLORS.background,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <img
        src={`${clientEnv.FRONTEND_URL}/jobstash-logo.png`}
        alt='JobStash'
        width={48}
        height={48}
      />
      <div
        style={{
          fontSize: 40,
          fontWeight: 700,
          color: COLORS.text,
        }}
      >
        Job Not Found
      </div>
    </div>
  </div>
);

interface PillProps {
  children: string;
}

const Pill = ({ children }: PillProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 20px',
      backgroundColor: COLORS.surface,
      borderRadius: 999,
      border: `1px solid ${COLORS.border}`,
    }}
  >
    <div
      style={{
        fontSize: 20,
        fontWeight: 500,
        color: COLORS.pillText,
      }}
    >
      {children}
    </div>
  </div>
);

const OpengraphImage = async ({ params }: Props) => {
  const { id } = await params;
  const job = await fetchJobDetails({ id });

  if (!job) {
    return new ImageResponse(<JobNotFoundImage />, size);
  }

  const {
    title,
    orgName,
    orgLogo,
    salary,
    location,
    workMode,
    seniority,
    commitment,
  } = extractOgImageData(job);

  const locationHasRemote = location?.toLowerCase().includes('remote');
  const formattedSalary = salary?.startsWith('$') ? salary : `$${salary}`;

  const pills: string[] = [
    seniority && `Role: ${seniority}`,
    salary && formattedSalary,
    location && `Location: ${location}`,
    workMode && !locationHasRemote && `Mode: ${workMode}`,
    commitment && `Contract: ${commitment}`,
  ].filter((pill): pill is string => Boolean(pill));

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.background,
        padding: '56px 64px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <img
          src={`${clientEnv.FRONTEND_URL}/jobstash-logo.png`}
          alt='JobStash'
          width={52}
          height={52}
          style={{
            borderRadius: 10,
          }}
        />
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: COLORS.text,
          }}
        >
          JobStash
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: COLORS.textMuted,
            marginLeft: 8,
            marginRight: 8,
          }}
        >
          ×
        </div>

        {orgLogo ? (
          <img
            src={orgLogo}
            alt={orgName ?? 'Company'}
            width={52}
            height={52}
            style={{
              borderRadius: 10,
              objectFit: 'contain',
              backgroundColor: COLORS.surface,
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              width: 52,
              height: 52,
              backgroundColor: COLORS.surface,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: COLORS.textMuted,
              }}
            >
              {orgName ? orgName.charAt(0).toUpperCase() : '?'}
            </div>
          </div>
        )}

        {orgName && (
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: COLORS.text,
            }}
          >
            {orgName}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          marginTop: 32,
          marginBottom: 48,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: COLORS.text,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
          }}
        >
          {title}
        </div>
      </div>

      {pills.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 12,
          }}
        >
          {pills.map((pill, index) => (
            <Pill key={index}>{pill}</Pill>
          ))}
        </div>
      )}
    </div>,
    size,
  );
};

export default OpengraphImage;
