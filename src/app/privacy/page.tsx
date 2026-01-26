import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | JobStash',
  description: 'Privacy Policy for JobStash - Crypto Native Jobs',
};

const PrivacyPage = () => {
  return (
    <div className='py-12'>
      <h1 className='mb-8 text-3xl font-bold'>Privacy Policy</h1>
      <p className='text-muted-foreground'>
        This page will contain the JobStash privacy policy.
      </p>
    </div>
  );
};

export default PrivacyPage;
