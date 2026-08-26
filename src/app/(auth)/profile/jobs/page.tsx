import { JobsForMe } from '@/features/profile/components/jobs-for-me';

const ProfileJobsPage = () => (
  <div className='space-y-6'>
    <div>
      <h1 className='text-2xl font-semibold'>Jobs for me</h1>
      <p className='mt-1 text-sm text-muted-foreground'>
        Fresh matches from your activity.
      </p>
    </div>
    <section aria-label='Recommended jobs'>
      <JobsForMe />
    </section>
  </div>
);

export default ProfileJobsPage;
