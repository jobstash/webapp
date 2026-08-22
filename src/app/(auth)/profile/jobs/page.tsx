import { JobsForMe } from '@/features/profile/components/jobs-for-me';
import { ProfileJobs } from '@/features/profile/components/profile-jobs';

const ProfileJobsPage = () => (
  <div className='space-y-10'>
    <div>
      <h1 className='text-2xl font-semibold'>Jobs for me</h1>
      <p className='mt-1 text-sm text-muted-foreground'>
        Review work-preference matches and roles related to your saved skills.
      </p>
    </div>
    <section aria-label='Work preference matches'>
      <JobsForMe />
    </section>
    <section aria-label='Skill matches'>
      <ProfileJobs />
    </section>
  </div>
);

export default ProfileJobsPage;
