'use client';

import { Button } from '@/components/ui/button';

const scrollToJobs = () => {
  document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
};

export const BrowseJobsButton = () => (
  <Button size='lg' onClick={scrollToJobs}>
    Browse Jobs
  </Button>
);
