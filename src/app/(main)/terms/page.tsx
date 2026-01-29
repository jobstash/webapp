import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | JobStash',
  description: 'Terms of Service for JobStash - Crypto Native Jobs',
};

const TermsPage = () => {
  return (
    <div className='py-12'>
      <h1 className='mb-8 text-3xl font-bold'>Terms of Service</h1>
      <p className='text-muted-foreground'>
        This page will contain the JobStash terms of service.
      </p>
    </div>
  );
};

export default TermsPage;
