'use client';

import { Button } from '@/components/ui/button';

const scrollToJobs = () => {
  document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
};

export const BrowseJobsButton = () => (
  <Button
    size='lg'
    variant='secondary'
    className='bg-input/30'
    onClick={scrollToJobs}
  >
    Browse Jobs
  </Button>
);
