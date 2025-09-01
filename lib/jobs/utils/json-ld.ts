import 'server-only';

import { CLIENT_ENVS } from '@/lib/shared/core/client.env';
import type { JobDetailsSchema } from '@/lib/jobs/core/schemas';

interface GenerateJobPostingJsonLdParams {
  job: JobDetailsSchema;
  slug: string;
  id: string;
}

export const generateJobPostingJsonLd = ({
  job,
  slug,
  id,
}: GenerateJobPostingJsonLdParams): string => {
  const structuredData = buildJobPostingStructuredData({ job, slug, id });
  return JSON.stringify(structuredData, null, 2).replace(/</g, '\\u003c');
};

const buildJobPostingStructuredData = ({
  job,
  slug,
  id,
}: GenerateJobPostingJsonLdParams) => {
  const jobInfo = extractJobInfo(job);
  const baseSalary = parseSalaryInfo(jobInfo.salary);
  const jobLocation = buildJobLocation(jobInfo.location);
  const hiringOrganization = buildHiringOrganization(job.organization);

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    '@id': `${CLIENT_ENVS.FRONTEND_URL}/jobs/${slug}/${id}`,
    title: job.title,
    description:
      job.summary ||
      job.description ||
      `Join ${job.organization?.name || 'our team'} as a ${job.title}. This is an exciting opportunity in the crypto and blockchain space.`,
    identifier: {
      '@type': 'PropertyValue',
      name: 'JobStash Job ID',
      value: id,
    },
    datePosted: new Date().toISOString().split('T')[0],
    validThrough: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: normalizeEmploymentType(jobInfo.commitment),
    hiringOrganization,
    jobLocation,
    url: `${CLIENT_ENVS.FRONTEND_URL}/jobs/${slug}/${id}`,
    applicationContact: {
      '@type': 'ContactPoint',
      email: 'jobs@jobstash.xyz',
      contactType: 'HR Department',
    },
    ...(baseSalary.salary && { baseSalary: baseSalary.salary }),
    ...(baseSalary.currency && { salaryCurrency: baseSalary.currency }),
    ...(job.requirements?.length && {
      educationRequirements: job.requirements.join('; '),
    }),
    ...(job.responsibilities?.length && {
      responsibilities: job.responsibilities.join('; '),
    }),
    ...(job.benefits?.length && {
      jobBenefits: job.benefits.join('; '),
    }),
    ...(jobInfo.seniority && {
      experienceRequirements: jobInfo.seniority.replace(/seniority:\s*/i, ''),
    }),
    qualifications: buildQualifications(job, jobInfo.seniority),
    skills:
      job.tags?.map((tag) => tag.name).join(', ') || 'Blockchain, Cryptocurrency, Web3',
    industry: 'Cryptocurrency and Blockchain',
    occupationalCategory: 'Computer and Mathematical Occupations',
    workHours: jobInfo.commitment?.toLowerCase().includes('part')
      ? 'Part-time'
      : 'Full-time',
    ...(jobInfo.workMode && {
      jobLocationType: jobInfo.workMode.toLowerCase().includes('remote')
        ? 'TELECOMMUTE'
        : 'ON_SITE',
    }),
    specialCommitments: 'CryptoCommit',
    ...(job.infoTags?.find((tag) => tag.iconKey === 'paysInCrypto') && {
      incentiveCompensation: 'Cryptocurrency compensation available',
    }),
    publisher: {
      '@type': 'Organization',
      name: 'JobStash',
      url: CLIENT_ENVS.FRONTEND_URL,
      logo: `${CLIENT_ENVS.FRONTEND_URL}/jobstash-logo.png`,
    },
  };
};

const extractJobInfo = (job: JobDetailsSchema) => ({
  salary: job.infoTags?.find((tag) => tag.iconKey === 'salary')?.label,
  location: job.infoTags?.find((tag) => tag.iconKey === 'location')?.label,
  commitment: job.infoTags?.find((tag) => tag.iconKey === 'commitment')?.label,
  seniority: job.infoTags?.find((tag) => tag.iconKey === 'seniority')?.label,
  workMode: job.infoTags?.find((tag) => tag.iconKey === 'workMode')?.label,
});

const parseSalaryInfo = (salaryInfo?: string) => {
  if (!salaryInfo) return { salary: null, currency: 'USD' };

  const salaryMatch = salaryInfo.match(
    /Salary:\s*\$?(\d+[\d,]*)\s*-?\s*\$?(\d+[\d,]*)?\s*(\w+)?/i,
  );

  if (!salaryMatch) return { salary: null, currency: 'USD' };

  const minSalary = salaryMatch[1]?.replace(/,/g, '');
  const maxSalary = salaryMatch[2]?.replace(/,/g, '');
  const currency = salaryMatch[3] || 'USD';

  if (minSalary && maxSalary) {
    return {
      salary: {
        '@type': 'MonetaryAmount',
        currency,
        value: {
          '@type': 'QuantitativeValue',
          minValue: minSalary,
          maxValue: maxSalary,
          unitText: 'YEAR',
        },
      },
      currency,
    };
  }

  if (minSalary) {
    return {
      salary: {
        '@type': 'MonetaryAmount',
        currency,
        value: {
          '@type': 'QuantitativeValue',
          value: minSalary,
          unitText: 'YEAR',
        },
      },
      currency,
    };
  }

  return { salary: null, currency };
};

const buildJobLocation = (locationInfo?: string) => {
  const locationName = locationInfo?.replace('Location: ', '') || 'Remote';
  const isRemote = locationName.toLowerCase().includes('remote');

  return {
    '@type': 'Place',
    name: locationName,
    address: {
      '@type': 'PostalAddress',
      addressLocality: isRemote ? 'Remote' : locationName,
      addressCountry: 'Global',
    },
  };
};

const buildHiringOrganization = (organization?: JobDetailsSchema['organization']) => ({
  '@type': 'Organization',
  name: organization?.name || 'Crypto Company',
  url: organization?.href || CLIENT_ENVS.VERI_URL,
  logo: organization?.logo || `${CLIENT_ENVS.FRONTEND_URL}/jobstash-logo.png`,
  description: `${organization?.name || 'A leading crypto company'} is hiring for blockchain and cryptocurrency positions.`,
});

const normalizeEmploymentType = (commitment?: string): string => {
  if (!commitment) return 'FULL_TIME';
  return commitment.replace(/commitment:\s*/i, '').toUpperCase();
};

const buildQualifications = (job: JobDetailsSchema, seniority?: string): string => {
  const qualifications: string[] = [
    ...(job.requirements || []),
    ...(seniority ? [seniority.replace(/seniority:\s*/i, '')] : []),
    'Interest in cryptocurrency and blockchain technology',
  ];

  return qualifications.join('; ');
};
