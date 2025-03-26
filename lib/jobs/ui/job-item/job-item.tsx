import Link from 'next/link';

import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { cn } from '@/lib/shared/utils';

import { BorderBeam } from '@/lib/shared/ui/base/border-beam';
import { InfoTags } from '@/lib/shared/ui/info-tags';
import { BookmarkButton } from '@/lib/bookmarks/ui/bookmark-button';
import { jobInfoTagsIconMap } from '@/lib/jobs/ui/job-icon-map';
import { JobItemBadge } from '@/lib/jobs/ui/job-item/job-item-badge';
import { JobItemSummary } from '@/lib/jobs/ui/job-item/job-item-summary';

import { JobItemOrg } from './job-item-org';
// import { JobItemProjects } from './job-list-item-projects';
import { JobItemTags } from './job-item-tags';
interface Props {
  job: JobItemSchema;
}

export const JobItem = ({ job }: Props) => {
  const {
    title,
    href,
    infoTags,
    tags,
    summary,
    organization,
    badge,
    hasGradientBorder,
    timestampText,
    isUrgentlyHiring,
    // promotionEndDate,
    // projects,
  } = job;

  return (
    <Link
      href={href}
      className='relative flex w-full flex-col gap-4 rounded-3xl border border-neutral-800/80 bg-sidebar p-6'
    >
      <div className='flex items-baseline justify-between'>
        <div className='flex flex-col gap-0'>
          <JobItemBadge badge={badge} />
          <h2 className='text-xl font-bold'>{title}</h2>
        </div>
        <div className='flex items-center gap-2'>
          <span
            className={cn('text-xs text-neutral-400', {
              'font-semibold text-white': isUrgentlyHiring,
            })}
          >
            {timestampText}
          </span>
          <BookmarkButton />
        </div>
      </div>
      <InfoTags iconMap={jobInfoTagsIconMap} infoTags={infoTags} />
      <JobItemOrg org={organization} />
      <JobItemSummary summary={summary} />
      <JobItemTags tags={tags} />
      {/* <JobItemProjects projects={projects} /> */}
      {hasGradientBorder && <BorderBeam size={320} duration={12} delay={9} />}
    </Link>
  );
};
