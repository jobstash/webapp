'use client';

import { Button } from '@/components/ui/button';
import { GA_EVENT, trackEvent } from '@/lib/analytics';

const handleClick = () => {
  trackEvent(GA_EVENT.HERO_CTA_CLICKED, { source: 'browse_jobs' });
  document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
};

export const BrowseJobsButton = () => (
  <Button
    size='lg'
    variant='secondary'
    className='bg-input/30'
    onClick={handleClick}
  >
    Browse Jobs
  </Button>
);
