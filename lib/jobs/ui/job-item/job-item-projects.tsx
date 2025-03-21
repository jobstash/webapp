import { Fragment } from 'react';

import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { Divider } from '@/lib/shared/ui/divider';
import { InfoTags } from '@/lib/shared/ui/info-tags';
import { LogoTitle } from '@/lib/shared/ui/logo-title';
import { jobProjectInfoTagsIconMap } from '@/lib/jobs/ui/job-icon-map';

interface Props {
  projects: JobItemSchema['projects'];
}

export const JobItemProjects = ({ projects }: Props) => {
  return projects.map(({ name, logo, infoTags }) => (
    <Fragment key={name}>
      <Divider />
      <div className='flex flex-col gap-4'>
        <div key={name} className='flex items-center gap-4'>
          <LogoTitle size='sm' title={name} src={logo ?? ''} />
          {infoTags.length > 0 && (
            <InfoTags iconMap={jobProjectInfoTagsIconMap} infoTags={infoTags} />
          )}
        </div>
      </div>
    </Fragment>
  ));
};
