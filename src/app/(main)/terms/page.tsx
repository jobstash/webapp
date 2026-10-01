import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for JobStash - Crypto Native Jobs',
};

const TermsPage = () => {
  return (
    <div className='py-12'>
      <h1 className='mb-8 text-3xl font-bold'>Terms of Service</h1>
      <p className='text-muted-foreground'>
        This page will contain the JobStash terms of service.
      </p>
      <section className='mt-10 space-y-3'>
        <h2 className='text-xl font-semibold'>Data attribution</h2>
        <p className='text-muted-foreground'>
          Location data includes information from{' '}
          <a
            className='underline underline-offset-4 hover:text-foreground'
            href='https://www.geonames.org/'
          >
            GeoNames
          </a>
          , licensed under{' '}
          <a
            className='underline underline-offset-4 hover:text-foreground'
            href='https://creativecommons.org/licenses/by/4.0/'
          >
            Creative Commons Attribution 4.0
          </a>
          . We normalize this data for job location search.
        </p>
      </section>
    </div>
  );
};

export default TermsPage;
