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
  const locationType = extractLocationType(job.infoTags, job.addresses);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.summary || job.description,
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

  // Use job-level addresses for structured PostalAddress
  if (job.addresses?.length) {
    schema.jobLocation = job.addresses.map((addr) => ({
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: addr.countryCode,
        ...(addr.locality && { addressLocality: addr.locality }),
        ...(addr.region && { addressRegion: addr.region }),
        ...(addr.postalCode && { postalCode: addr.postalCode }),
        ...(addr.street && { streetAddress: addr.street }),
      },
      ...(addr.geo && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: addr.geo.latitude,
          longitude: addr.geo.longitude,
        },
      }),
    }));
  } else if (job.organization?.location) {
    // Fallback to organization location string
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
