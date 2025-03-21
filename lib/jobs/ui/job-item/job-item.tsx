import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { BorderBeam } from '@/lib/shared/ui/base/border-beam';
import { InfoTags } from '@/lib/shared/ui/info-tags';
import { jobInfoTagsMap } from '@/lib/jobs/ui/tag-icon-map';

import { JobItemOrg } from './job-item-org';
// import { JobItemProjects } from './job-list-item-projects';
import { JobItemTags } from './job-item-tags';
interface Props {
  job: JobItemSchema;
}

export const JobItem = ({ job }: Props) => {
  const {
    title,
    infoTags,
    tags,
    organization,
    timestampText,
    // projects,
    promotion: { isFeatured },
  } = job;

  return (
    <article className='relative flex w-full flex-col gap-4 rounded-3xl border border-neutral-800/80 bg-sidebar p-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold'>{title}</h2>
        <span className='text-xs text-neutral-400'>{timestampText}</span>
      </div>
      <InfoTags iconMap={jobInfoTagsMap} infoTags={infoTags} />
      <JobItemOrg org={organization} />
      <JobItemTags tags={tags} />
      {/* <JobItemProjects projects={projects} /> */}
      {isFeatured && <BorderBeam size={320} duration={12} delay={9} />}
    </article>
  );
};
