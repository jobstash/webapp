import type { Address, MappedInfoTagSchema } from '@/lib/schemas';
import type { JobDetailsSchema } from '@/features/jobs/schemas';

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

interface OgImageData {
  title: string;
  orgName: string | null;
  orgLogo: string | null;
  salary: string | null;
  location: string | null;
  workMode: string | null;
  seniority: string | null;
  commitment: string | null;
  description: string | null;
  badge: string | null;
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
};

export const formatLocationText = (
  addresses: Address[] | null | undefined,
  orgLocation: string | null | undefined,
): string | null => {
  if (addresses?.some((addr) => addr.isRemote)) {
    return 'Remote';
  }

  const firstAddress = addresses?.find((addr) => addr.locality || addr.country);
  if (firstAddress?.locality) {
    return `${firstAddress.locality}, ${firstAddress.country}`;
  }
  if (firstAddress?.country) {
    return firstAddress.country;
  }

  return orgLocation ?? null;
};

const getInfoTagLabel = (
  infoTags: MappedInfoTagSchema[],
  iconKey: string,
): string | null => {
  return infoTags.find((tag) => tag.iconKey === iconKey)?.label ?? null;
};

export const extractOgImageData = (job: JobDetailsSchema): OgImageData => {
  return {
    title: truncateText(job.title, 60),
    orgName: job.organization?.name ?? null,
    orgLogo: job.organization?.logo ?? null,
    salary: getInfoTagLabel(job.infoTags, 'salary'),
    location: formatLocationText(job.addresses, job.organization?.location),
    workMode: getInfoTagLabel(job.infoTags, 'workMode'),
    seniority: getInfoTagLabel(job.infoTags, 'seniority'),
    commitment: getInfoTagLabel(job.infoTags, 'commitment'),
    description: job.summary ?? job.description ?? null,
    badge: job.badge,
  };
};
