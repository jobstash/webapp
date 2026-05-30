'use client';

import Link from 'next/link';

import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { POST_JOB_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { PrimaryCTA } from '@/components/primary-cta';
import { HeroJobsForYouButton } from '@/components/hero-jobs-for-you-button.lazy';

interface PillarLink {
  slug: string;
  label: string;
  gaSource: string;
}

const URGENTLY_HIRING: PillarLink = {
  slug: 'urgently-hiring',
  label: 'Urgently Hiring',
  gaSource: 'urgently_hiring',
};

const CRYPTO_BEGINNER_JOBS: PillarLink = {
  slug: 'crypto-beginner-jobs',
  label: 'Crypto Beginner Jobs',
  gaSource: 'crypto_beginner_jobs',
};

const SECONDARY_CLASS = 'bg-input/30 text-base';

const PrimaryPillarButton = ({ pillar }: { pillar: PillarLink }) => (
  <PrimaryCTA asChild className='px-6 text-base'>
    <Link
      href={`/${pillar.slug}`}
      onClick={() =>
        trackEvent(GA_EVENT.HERO_CTA_CLICKED, { source: pillar.gaSource })
      }
    >
      {pillar.label}
    </Link>
  </PrimaryCTA>
);

const SecondaryPillarButton = ({ pillar }: { pillar: PillarLink }) => (
  <Button size='lg' variant='secondary' className={SECONDARY_CLASS} asChild>
    <Link
      href={`/${pillar.slug}`}
      onClick={() =>
        trackEvent(GA_EVENT.HERO_CTA_CLICKED, { source: pillar.gaSource })
      }
    >
      {pillar.label}
    </Link>
  </Button>
);

const PostAJobButton = () => (
  <Button size='lg' variant='secondary' className={SECONDARY_CLASS} asChild>
    <Link
      href={POST_JOB_URL}
      onClick={() =>
        trackEvent(GA_EVENT.HERO_CTA_CLICKED, { source: 'post_job' })
      }
    >
      Post a Job
    </Link>
  </Button>
);

interface Props {
  slug?: string;
}

export const HeroCtas = ({ slug }: Props) => {
  if (slug === URGENTLY_HIRING.slug) {
    return (
      <div className='flex flex-col items-center gap-3 sm:flex-row'>
        <HeroJobsForYouButton variant='primary' />
        <SecondaryPillarButton pillar={CRYPTO_BEGINNER_JOBS} />
        <PostAJobButton />
      </div>
    );
  }

  if (slug === CRYPTO_BEGINNER_JOBS.slug) {
    return (
      <div className='flex flex-col items-center gap-3 sm:flex-row'>
        <PrimaryPillarButton pillar={URGENTLY_HIRING} />
        <HeroJobsForYouButton />
        <PostAJobButton />
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center gap-3 sm:flex-row'>
      <PrimaryPillarButton pillar={URGENTLY_HIRING} />
      <SecondaryPillarButton pillar={CRYPTO_BEGINNER_JOBS} />
      <HeroJobsForYouButton />
    </div>
  );
};
