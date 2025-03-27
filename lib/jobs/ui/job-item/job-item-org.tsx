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

  return (
    <>
      <Divider />
      <div className='flex items-center gap-4'>
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
        {infoTags && <InfoTags iconMap={jobOrgInfoTagsIconMap} infoTags={infoTags} />}
      </div>
    </>
  );
};
