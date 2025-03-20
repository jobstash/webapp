import { JobListItemSchema } from '@/lib/jobs/core/schemas';

import { InfoTags } from '@/lib/shared/ui/info-tags';
import { jobInfoTagsMap } from '@/lib/jobs/ui/tag-icon-map';

import { JobListItemOrg } from './job-list-item-org';
import { JobListItemProjects } from './job-list-item-projects';
import { JobListItemTags } from './job-list-item-tags';
interface Props {
  job: JobListItemSchema;
}

export const JobListItem = ({ job }: Props) => {
  const { title, infoTags, tags, organization, projects } = job;

  return (
    <article className='flex w-full flex-col gap-4 rounded-3xl border border-neutral-800/80 bg-sidebar p-6'>
      <h2 className='text-xl font-bold'>{title}</h2>
      <InfoTags iconMap={jobInfoTagsMap} infoTags={infoTags} />
      <JobListItemOrg org={organization} />
      <JobListItemTags tags={tags} />
      <JobListItemProjects projects={projects} />
    </article>
  );
};
