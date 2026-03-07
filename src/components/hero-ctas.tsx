'use client';

import Link from 'next/link';

import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { POST_JOB_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { PrimaryCTA } from '@/components/primary-cta';
import { HeroJobsForYouButton } from '@/components/hero-jobs-for-you-button.lazy';

interface Props {
  slug?: string;
}

export const HeroCtas = ({ slug }: Props) => {
  if (slug === 'urgently-hiring') {
    return (
      <div className='flex flex-col items-center gap-3 sm:flex-row'>
        <HeroJobsForYouButton variant='primary' />
        <Button
          size='lg'
          variant='secondary'
          className='bg-input/30 text-base'
          asChild
        >
          <Link
            href={POST_JOB_URL}
            onClick={() =>
              trackEvent(GA_EVENT.HERO_CTA_CLICKED, { source: 'post_job' })
            }
          >
            Post a Job
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center gap-3 sm:flex-row'>
      <PrimaryCTA asChild className='px-6 text-base'>
        <Link
          href='/urgently-hiring'
          onClick={() =>
            trackEvent(GA_EVENT.HERO_CTA_CLICKED, {
              source: 'urgently_hiring',
            })
          }
        >
          Urgently Hiring
        </Link>
      </PrimaryCTA>
      <HeroJobsForYouButton />
    </div>
  );
};
