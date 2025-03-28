import Link from 'next/link';

import { ExternalLinkIcon } from 'lucide-react';

import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { Button } from '@/lib/shared/ui/base/button';
import { Divider } from '@/lib/shared/ui/divider';
import { InfoTags } from '@/lib/shared/ui/info-tags';
import { LogoTitle } from '@/lib/shared/ui/logo-title';
import { jobOrgInfoTagsIconMap } from '@/lib/jobs/ui/job-icon-map';

interface Props {
  org: JobItemSchema['organization'];
}

export const JobItemOrg = ({ org }: Props) => {
  if (!org) return null;

  const { name, href, location, logo, infoTags } = org;
  const hasInfoTags = infoTags && infoTags.length > 0;

  return (
    <>
      <Divider />
      <div className='flex flex-col gap-4 md:flex-row md:items-center'>
        <LogoTitle
          size='sm'
          title={
            <div className='my-0 flex items-center gap-1'>
              <span className='text-sm leading-none font-bold'>{name}</span>
              <Button asChild variant='ghost' size='icon' className='size-4'>
                <Link href={href} target='_blank' rel='noopener noreferrer'>
                  <ExternalLinkIcon className='size-3.5 text-white/60' />
                </Link>
              </Button>
            </div>
          }
          subtitle={location}
          src={logo ?? ''}
        />
        {hasInfoTags && <InfoTags iconMap={jobOrgInfoTagsIconMap} infoTags={infoTags} />}
      </div>
    </>
  );
};
