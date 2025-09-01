import 'server-only';

import type { Metadata } from 'next';

import { CLIENT_ENVS } from '@/lib/shared/core/client.env';
import type { JobDetailsSchema } from '@/lib/jobs/core/schemas';

interface GenerateJobMetadataParams {
  job: JobDetailsSchema;
  slug: string;
  id: string;
}

export const generateJobMetadata = ({
  job,
  slug,
  id,
}: GenerateJobMetadataParams): Metadata => {
  const jobTitle = job.title;
  const orgName = job.organization?.name || 'Unknown Orgganization';
  const location =
    job.infoTags?.find((tag) => tag.iconKey === 'location')?.label || 'Remote';
  const salary = job.infoTags?.find((tag) => tag.iconKey === 'salary')?.label;
  const employmentType =
    job.infoTags?.find((tag) => tag.iconKey === 'commitment')?.label || 'Full-time';
  const seniority = job.infoTags?.find((tag) => tag.iconKey === 'seniority')?.label;

  const title = `${jobTitle} at ${orgName} | JobStash`;
  const description = buildJobDescription({
    jobTitle,
    orgName,
    location,
    salary,
    seniority,
    employmentType,
    summary: job.summary,
  });

  const jobUrl = `${CLIENT_ENVS.FRONTEND_URL}/${slug}/${id}`;

  const ogImageUrl = buildOgImageUrl({
    title: jobTitle,
    company: orgName,
    location,
    salary,
  });

  const keywords = buildKeywords({
    jobTitle,
    orgName,
    tags: job.tags,
    seniority,
    employmentType,
  });

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'JobStash' }],
    creator: 'JobStash',
    publisher: 'JobStash',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(CLIENT_ENVS.FRONTEND_URL),
    alternates: {
      canonical: jobUrl,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: jobUrl,
      siteName: 'JobStash',
      locale: 'en_US',
      type: 'article',
      publishedTime: new Date().toISOString(),
      authors: ['JobStash'],
      section: 'Jobs',
      tags: keywords,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${jobTitle} at ${orgName} - Job posting on JobStash`,
          type: 'image/png',
        },
        {
          url: `${CLIENT_ENVS.FRONTEND_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'JobStash - Crypto Native Jobs',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@jobstash_xyz',
      site: '@jobstash_xyz',
      images: [
        {
          url: ogImageUrl,
          alt: `${jobTitle} at ${orgName} - Job posting on JobStash`,
        },
      ],
    },
    other: {
      'application-name': 'JobStash',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'JobStash',
      'format-detection': 'telephone=no',
      'msapplication-TileColor': '#000000',
      'msapplication-config': '/browserconfig.xml',
      'theme-color': '#000000',
    },
  };
};

const buildJobDescription = ({
  jobTitle,
  orgName,
  location,
  salary,
  seniority,
  employmentType,
  summary,
}: {
  jobTitle: string;
  orgName: string;
  location: string;
  salary?: string;
  seniority?: string;
  employmentType: string;
  summary?: string | null;
}): string => {
  let description = `Join ${orgName} as a ${jobTitle}`;

  if (location) description += ` in ${location}`;
  if (salary) description += ` • ${salary}`;
  if (seniority) description += ` • ${seniority}`;
  if (employmentType) description += ` • ${employmentType}`;

  description += ' | Apply now on JobStash, the premier crypto native job board.';

  if (summary) {
    description = summary || description;
  }

  return description;
};

const buildOgImageUrl = ({
  title,
  company,
  location,
  salary,
}: {
  title: string;
  company: string;
  location: string;
  salary?: string;
}): string => {
  const baseUrl = `${CLIENT_ENVS.FRONTEND_URL}/api/og`;
  const params = new URLSearchParams({
    title,
    company,
  });

  if (location) params.set('location', location);
  if (salary) params.set('salary', salary);

  return `${baseUrl}?${params.toString()}`;
};

const buildKeywords = ({
  jobTitle,
  orgName,
  tags,
  seniority,
  employmentType,
}: {
  jobTitle: string;
  orgName: string;
  tags?: Array<{ name: string }>;
  seniority?: string;
  employmentType: string;
}): string[] => [
  'crypto jobs',
  'blockchain jobs',
  'web3 jobs',
  jobTitle.toLowerCase(),
  orgName.toLowerCase(),
  ...(tags?.map((tag) => tag.name.toLowerCase()) || []),
  ...(seniority ? [seniority.toLowerCase()] : []),
  employmentType.toLowerCase(),
  'remote work',
  'cryptocurrency',
  'DeFi',
  'NFT',
  'smart contracts',
];

export const generateJobNotFoundMetadata = (): Metadata => ({
  title: 'Job Not Found | JobStash',
  description: 'The requested job posting could not be found.',
  robots: {
    index: false,
    follow: false,
  },
});
