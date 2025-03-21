import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { Divider } from '@/lib/shared/ui/divider';
import { InfoTags } from '@/lib/shared/ui/info-tags';
import { LogoTitle } from '@/lib/shared/ui/logo-title';
import { jobOrgInfoTagsMap } from '@/lib/jobs/ui/tag-icon-map';

interface Props {
  org: JobItemSchema['organization'];
}

export const JobItemOrg = ({ org }: Props) => {
  if (!org) return null;

  const { name, location, logo, infoTags } = org;

  return (
    <>
      <Divider />
      <div className='flex items-center gap-4'>
        <LogoTitle size='sm' title={name} subtitle={location} src={logo ?? ''} />
        {infoTags && <InfoTags iconMap={jobOrgInfoTagsMap} infoTags={infoTags} />}
      </div>
    </>
  );
};
