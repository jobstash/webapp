// oxlint-disable no-img-element
import { ImageResponse } from 'next/og';

import {
  extractOgImageData,
  OG_IMAGE_SIZE,
  truncateText,
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
  textSecondary: '#c7cacf',
  textMuted: '#9CA3AF',
  pillText: '#E5E7EB',
  badgeFeatured: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
  badgeBeginner: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
  badgeUrgent: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
} as const;

const MAX_DESCRIPTION_LENGTH = 220;

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
        gap: 20,
      }}
    >
      <img
        src={`${clientEnv.FRONTEND_URL}/jobstash-logo.png`}
        alt='JobStash'
        width={56}
        height={56}
      />
      <div
        style={{
          fontSize: 48,
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
      padding: '14px 24px',
      backgroundColor: COLORS.surface,
      borderRadius: 999,
      border: `1px solid ${COLORS.border}`,
    }}
  >
    <div
      style={{
        fontSize: 24,
        fontWeight: 500,
        color: COLORS.pillText,
      }}
    >
      {children}
    </div>
  </div>
);

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  Featured: COLORS.badgeFeatured,
  'Job for Web3 Beginners': COLORS.badgeBeginner,
  'Urgently Hiring': COLORS.badgeUrgent,
};

const getBadgeColors = (badge: string) => {
  return BADGE_COLORS[badge] ?? { bg: COLORS.surface, text: COLORS.pillText };
};

interface BadgePillProps {
  badge: string;
}

const BadgePill = ({ badge }: BadgePillProps) => {
  const colors = getBadgeColors(badge);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '14px 24px',
        backgroundColor: colors.bg,
        borderRadius: 999,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 500,
          color: colors.text,
        }}
      >
        {badge}
      </div>
    </div>
  );
};

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
    description,
    badge,
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
        padding: '56px',
        gap: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <img
          src={`${clientEnv.FRONTEND_URL}/jobstash-logo.png`}
          alt='JobStash'
          width={60}
          height={60}
          style={{
            borderRadius: 12,
          }}
        />
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: COLORS.text,
          }}
        >
          JobStash
        </div>

        <div
          style={{
            fontSize: 44,
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
            width={60}
            height={60}
            style={{
              borderRadius: 12,
              objectFit: 'contain',
              backgroundColor: COLORS.surface,
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              width: 60,
              height: 60,
              backgroundColor: COLORS.surface,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                fontSize: 32,
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
              fontSize: 36,
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
          flexWrap: 'wrap',
          maxWidth: '100%',
          fontSize: 72,
          fontWeight: 900,
          color: COLORS.text,
          lineHeight: 1.1,
          letterSpacing: '-0.025em',
        }}
      >
        {title}
      </div>

      {description && (
        <span
          style={{
            maxWidth: '95%',
            fontSize: 30,
            fontWeight: 400,
            color: COLORS.textSecondary,
            lineHeight: 1.4,
            marginBottom: 12,
          }}
        >
          {truncateText(description, MAX_DESCRIPTION_LENGTH)}
        </span>
      )}

      {(badge || pills.length > 0) && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          {badge && <BadgePill badge={badge} />}
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
