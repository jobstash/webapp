import type { Metadata } from 'next';

import { TestErrorBoundary } from '@/features/error-reporter/test-error-boundary';

export const metadata: Metadata = {
  title: 'Test Error Reporting',
  robots: 'noindex',
};

const TestPage = () => (
  <div className='flex min-h-screen flex-col items-center gap-6 p-8'>
    <h1 className='text-2xl font-semibold'>Error Reporter Test</h1>
    <p className='text-muted-foreground'>
      Click the button to trigger a test error and verify reporting.
    </p>
    <TestErrorBoundary />
  </div>
);

export default TestPage;
