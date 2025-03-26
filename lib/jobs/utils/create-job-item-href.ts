import 'server-only';

import { slugify } from '@/lib/shared/utils/slugify';

import { JobItemDto } from '@/lib/jobs/server/dtos';

export const createJobItemHref = (job: JobItemDto) => {
  const orgText = job.organization?.name ? `-${job.organization?.name}` : '';
  const slug = slugify(`${job.title}${orgText}`);
  return `/${slug}/${job.shortUUID}`;
};
