'use client';

import { JobsForYou } from './jobs-for-you/jobs-for-you';
import { ProfileCard } from './profile-card';
import { ProfilePillarLinks } from './profile-pillar-links';

export const ProfileJobs = () => (
  <div className='flex flex-col gap-4'>
    <ProfileCard>
      <JobsForYou />
    </ProfileCard>
    <ProfileCard>
      <ProfilePillarLinks />
    </ProfileCard>
  </div>
);
