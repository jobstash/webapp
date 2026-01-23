import type { JobDetailsSchema } from '@/features/jobs/schemas';
import {
  extractEmploymentType,
  extractLocationType,
  extractSalaryData,
} from '@/features/jobs/lib/seo-utils';

interface Props {
  job: JobDetailsSchema;
}

/**
 * Builds Schema.org JobPosting structured data for SEO
 */
const buildJobPostingSchema = (
  job: JobDetailsSchema,
): Record<string, unknown> => {
  const salaryData = extractSalaryData(job.infoTags);
  const employmentType = extractEmploymentType(job.infoTags);
  const locationType = extractLocationType(job.infoTags);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || job.summary,
    datePosted: new Date().toISOString().split('T')[0],
    employmentType,
    directApply: !!job.applyUrl,
  };

  if (job.organization) {
    schema.hiringOrganization = {
      '@type': 'Organization',
      name: job.organization.name,
      ...(job.organization.websiteUrl && {
        sameAs: job.organization.websiteUrl,
      }),
      ...(job.organization.logo && { logo: job.organization.logo }),
    };
  }

  if (job.organization?.location) {
    schema.jobLocation = {
      '@type': 'Place',
      address: job.organization.location,
    };
  }

  if (salaryData) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: salaryData.currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: salaryData.minValue,
        maxValue: salaryData.maxValue,
        unitText: 'YEAR',
      },
    };
  }

  if (locationType === 'TELECOMMUTE') {
    schema.jobLocationType = 'TELECOMMUTE';
  }

  if (job.tags.length > 0) {
    schema.skills = job.tags.map((tag) => tag.name);
  }

  return schema;
};

/**
 * Server component that renders Schema.org JobPosting JSON-LD for SEO
 */
export const JobPostingSchema = ({ job }: Props) => {
  const schema = buildJobPostingSchema(job);

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
