// oxlint-disable no-img-element
import { ImageResponse } from 'next/og';

import { isValidPillarSlug } from '@/features/pillar/constants';
import {
  extractPillarOgImageData,
  OG_IMAGE_SIZE,
} from '@/features/pillar/lib/og-image-utils';
import { fetchPillarPageStatic } from '@/features/pillar/server';
import { clientEnv } from '@/lib/env/client';

export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';
export const alt = 'Pillar page on JobStash';

interface Props {
  params: Promise<{ slug: string }>;
}

const COLORS = {
  background: '#121212',
  surface: '#1E1E1E',
  border: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#c7cacf',
  textMuted: '#9CA3AF',
  separator: '#4B5563',
} as const;

const LOGO_SIZE = 36;

const PageNotFoundImage = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      width: '100%',
      height: '100%',
      backgroundColor: COLORS.background,
    }}
  >
    <img
      src={`${clientEnv.FRONTEND_URL}/jobstash-logo.png`}
      alt='JobStash'
      width={48}
      height={48}
    />
    <span
      style={{
        fontSize: 40,
        fontWeight: 700,
        color: COLORS.text,
      }}
    >
      Page Not Found
    </span>
  </div>
);

interface CategoryPillProps {
  label: string;
  accentColor: string;
}

const CategoryPill = ({ label, accentColor }: CategoryPillProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      backgroundColor: COLORS.surface,
      borderRadius: 999,
      border: `1px solid ${COLORS.border}`,
    }}
  >
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: accentColor,
      }}
    />
    <span
      style={{
        fontSize: 18,
        fontWeight: 500,
        color: COLORS.text,
      }}
    >
      {label}
    </span>
  </div>
);

interface OrgItemProps {
  name: string;
  logo: string | null;
  accentColor: string;
}

const OrgItem = ({ name, logo, accentColor }: OrgItemProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    {logo ? (
      <img
        src={logo}
        alt={name}
        width={LOGO_SIZE}
        height={LOGO_SIZE}
        style={{ borderRadius: 6, objectFit: 'contain' }}
      />
    ) : (
      <div
        style={{
          display: 'flex',
          width: LOGO_SIZE,
          height: LOGO_SIZE,
          backgroundColor: accentColor,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 700,
          color: COLORS.background,
        }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    )}
    <span style={{ fontSize: 18, fontWeight: 500, color: COLORS.text }}>
      {name}
    </span>
  </div>
);

interface OverflowBadgeProps {
  count: number;
}

const OverflowBadge = ({ count }: OverflowBadgeProps) => (
  <span style={{ fontSize: 18, fontWeight: 500, color: COLORS.textMuted }}>
    +{count} more {count === 1 ? 'organization' : 'organizations'}
  </span>
);

const HEADLINE_STYLE = {
  display: 'flex',
  marginTop: 28,
  fontSize: 60,
  fontWeight: 900,
  lineHeight: 1.1,
  letterSpacing: '-0.025em',
} as const;

interface HeadlineProps {
  text: string;
  coloredText: string | null;
  nameFirst: boolean;
  jobCountLabel: string;
  accentColor: string;
}

const Headline = ({
  text,
  coloredText,
  nameFirst,
  jobCountLabel,
  accentColor,
}: HeadlineProps) => {
  if (!coloredText) {
    return (
      <div style={HEADLINE_STYLE}>
        <span style={{ color: COLORS.text }}>
          New {text} ({jobCountLabel})
        </span>
      </div>
    );
  }

  if (nameFirst) {
    return (
      <div style={HEADLINE_STYLE}>
        <span style={{ color: COLORS.text }}>New&nbsp;</span>
        <span style={{ color: accentColor }}>{coloredText}&nbsp;</span>
        <span style={{ color: COLORS.text }}>
          {text} ({jobCountLabel})
        </span>
      </div>
    );
  }

  return (
    <div style={HEADLINE_STYLE}>
      <span style={{ color: COLORS.text }}>New {text}&nbsp;</span>
      <span style={{ color: accentColor }}>{coloredText}&nbsp;</span>
      <span style={{ color: COLORS.text }}>({jobCountLabel})</span>
    </div>
  );
};

const OpengraphImage = async ({ params }: Props) => {
  const { slug } = await params;

  if (!isValidPillarSlug(slug)) {
    return new ImageResponse(<PageNotFoundImage />, size);
  }

  const pillarData = await fetchPillarPageStatic(slug);

  if (!pillarData) {
    return new ImageResponse(<PageNotFoundImage />, size);
  }

  const {
    headlineParts,
    jobCountLabel,
    description,
    categoryLabel,
    accentColor,
    orgs,
    overflowCount,
  } = extractPillarOgImageData(pillarData, slug);

  const truncatedDescription =
    description.length > 150 ? description.slice(0, 147) + '...' : description;

  const { text, coloredText, nameFirst } = headlineParts;

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img
          src={`${clientEnv.FRONTEND_URL}/jobstash-logo.png`}
          alt='JobStash'
          width={44}
          height={44}
          style={{ borderRadius: 8 }}
        />
        <span style={{ fontSize: 24, fontWeight: 600, color: COLORS.text }}>
          JobStash
        </span>
        <span
          style={{ fontSize: 28, fontWeight: 400, color: COLORS.textMuted }}
        >
          ×
        </span>
        <CategoryPill label={categoryLabel} accentColor={accentColor} />
      </div>

      <Headline
        text={text}
        coloredText={coloredText}
        nameFirst={nameFirst}
        jobCountLabel={jobCountLabel}
        accentColor={accentColor}
      />

      <span
        style={{
          marginTop: 16,
          marginBottom: 32,
          maxWidth: '95%',
          fontSize: 22,
          fontWeight: 400,
          color: COLORS.textSecondary,
          lineHeight: 1.4,
        }}
      >
        {truncatedDescription}
      </span>

      {orgs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {orgs.map((org, index) => (
              <div
                key={org.name}
                style={{ display: 'flex', alignItems: 'center', gap: 16 }}
              >
                {index > 0 && (
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 300,
                      color: COLORS.separator,
                    }}
                  >
                    |
                  </span>
                )}
                <OrgItem
                  name={org.name}
                  logo={org.logo}
                  accentColor={accentColor}
                />
              </div>
            ))}
          </div>
          {overflowCount > 0 && <OverflowBadge count={overflowCount} />}
        </div>
      )}
    </div>,
    size,
  );
};

export default OpengraphImage;
