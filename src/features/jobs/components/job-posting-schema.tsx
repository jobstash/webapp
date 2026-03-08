import type { JobDetailsSchema } from '@/features/jobs/schemas';
import {
  extractApplicantLocationRequirements,
  extractEmploymentType,
  extractJobLocationType,
  extractSalaryData,
} from '@/features/jobs/lib/seo-utils';

interface Props {
  job: JobDetailsSchema;
}

/** Builds Schema.org JobPosting structured data for SEO */
const buildJobPostingSchema = (
  job: JobDetailsSchema,
): Record<string, unknown> => {
  const salaryData = extractSalaryData(job.infoTags);
  const employmentType = extractEmploymentType(job.infoTags);
  const jobLocationType = extractJobLocationType(job.infoTags, job.addresses);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.summary || job.description,
    datePosted: job.datePosted,
    employmentType,
    directApply: job.hasApplyUrl,
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

  // Only emit jobLocation with structured PostalAddress data.
  // Plain strings (e.g. "Distributed") are invalid — Google requires
  // PostalAddress with addressCountry. Omitting is better than invalid data.
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

  if (jobLocationType === 'TELECOMMUTE') {
    const locationRequirements = extractApplicantLocationRequirements(
      job.addresses,
    );

    // Only emit TELECOMMUTE when we have valid country data for
    // applicantLocationRequirements — Google requires both together.
    // Jobs without address data skip the remote enrichment to stay valid.
    if (locationRequirements) {
      schema.jobLocationType = 'TELECOMMUTE';
      schema.applicantLocationRequirements = locationRequirements;
    }
  }

  if (job.tags.length > 0) {
    schema.skills = job.tags.map((tag) => tag.name);
  }

  return schema;
};

/** Server component that renders Schema.org JobPosting JSON-LD for SEO */
export const JobPostingSchema = ({ job }: Props) => {
  const schema = buildJobPostingSchema(job);

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
