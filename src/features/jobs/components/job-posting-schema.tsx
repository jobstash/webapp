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
export const buildJobPostingSchema = (
  job: JobDetailsSchema,
): Record<string, unknown> | null => {
  const salaryData = extractSalaryData(job.infoTags);
  const employmentType = extractEmploymentType(job.infoTags);
  const jobLocationType = extractJobLocationType(
    job.infoTags,
    job.addresses,
    job.locationType,
  );
  const description = job.description || job.summary;
  const physicalAddresses =
    jobLocationType === 'TELECOMMUTE'
      ? (job.addresses?.filter((address) => !address.isRemote) ?? [])
      : (job.addresses ?? []);
  const locationRequirements =
    jobLocationType === 'TELECOMMUTE'
      ? extractApplicantLocationRequirements(job.addresses)
      : null;

  // Google requires an employer, a way to apply, and either a physical
  // location or valid country restrictions for a fully remote role. When
  // upstream data cannot support those claims, omit JobPosting markup while
  // leaving the ordinary page indexable. Inventing a country is a policy
  // violation and invalid markup cannot appear in Google Jobs anyway.
  if (
    !description ||
    !job.organization ||
    !job.hasApplyUrl ||
    (jobLocationType === 'TELECOMMUTE'
      ? !locationRequirements
      : physicalAddresses.length === 0)
  ) {
    return null;
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description,
    datePosted: job.datePosted,
    identifier: {
      '@type': 'PropertyValue',
      name: job.organization.name,
      value: job.id,
    },
    employmentType,
    directApply: job.hasApplyUrl,
  };

  schema.hiringOrganization = {
    '@type': 'Organization',
    name: job.organization.name,
    ...(job.organization.websiteUrl && {
      sameAs: job.organization.websiteUrl,
    }),
    ...(job.organization.logo && { logo: job.organization.logo }),
  };

  // Only emit jobLocation with structured PostalAddress data.
  // Plain strings (e.g. "Distributed") are invalid — Google requires
  // PostalAddress with addressCountry. Omitting is better than invalid data.
  if (physicalAddresses.length > 0) {
    schema.jobLocation = physicalAddresses.map((addr) => ({
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
    schema.jobLocationType = 'TELECOMMUTE';
    schema.applicantLocationRequirements = locationRequirements;
  }

  if (job.tags.length > 0) {
    schema.skills = job.tags.map((tag) => tag.name);
  }

  return schema;
};

/** Server component that renders Schema.org JobPosting JSON-LD for SEO */
export const JobPostingSchema = ({ job }: Props) => {
  const schema = buildJobPostingSchema(job);
  if (!schema) return null;

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
