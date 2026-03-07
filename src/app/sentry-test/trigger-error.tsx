'use client';

import { useState } from 'react';

import * as Sentry from '@sentry/nextjs';

import { AppErrorBoundary } from '@/features/error-reporter/app-error-boundary';

import { throwServerError } from './actions';

const ThrowingComponent = () => {
  throw new Error(
    `[Sentry Test] ErrorBoundary catch at ${new Date().toISOString()}`,
  );
};

const ErrorBoundaryTest = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  return (
    <AppErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <div className='rounded bg-red-100 p-3 text-sm text-red-800'>
          <p>Caught by ErrorBoundary — reported to Sentry.</p>
          <button
            type='button'
            onClick={() => {
              setShouldThrow(false);
              resetErrorBoundary();
            }}
            className='mt-2 underline'
          >
            Reset
          </button>
        </div>
      )}
    >
      {shouldThrow ? (
        <ThrowingComponent />
      ) : (
        <button
          type='button'
          onClick={() => setShouldThrow(true)}
          className='w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
        >
          1. ErrorBoundary Catch
        </button>
      )}
    </AppErrorBoundary>
  );
};

export const TriggerError = () => {
  const [status, setStatus] = useState('');

  const triggerUnhandledError = () => {
    setStatus('Throwing unhandled error (auto-captured by SDK)...');
    setTimeout(() => {
      throw new Error(
        `[Sentry Test] Unhandled error at ${new Date().toISOString()}`,
      );
    }, 100);
  };

  const triggerUnhandledRejection = () => {
    setStatus('Triggering unhandled promise rejection (auto-captured)...');
    Promise.reject(
      new Error(
        `[Sentry Test] Unhandled rejection at ${new Date().toISOString()}`,
      ),
    );
  };

  const triggerCaptureException = () => {
    setStatus('Calling Sentry.captureException with context...');
    const error = new Error(
      `[Sentry Test] captureException at ${new Date().toISOString()}`,
    );
    Sentry.captureException(error, {
      tags: { test: true, source: 'sentry-test-page' },
      extra: { button: 'captureException', timestamp: Date.now() },
    });
    setStatus('captureException sent. Check Sentry dashboard.');
  };

  const triggerCaptureMessage = () => {
    setStatus('Calling Sentry.captureMessage...');
    Sentry.captureMessage('[Sentry Test] captureMessage test', {
      level: 'warning',
      extra: { button: 'captureMessage', timestamp: Date.now() },
    });
    setStatus('captureMessage sent (warning level). Check Sentry dashboard.');
  };

  const triggerServerActionError = async () => {
    setStatus(
      'Calling server action that throws (captured by onRequestError)...',
    );
    try {
      await throwServerError();
    } catch {
      setStatus(
        'Server action threw. Check Sentry dashboard for server-side event.',
      );
    }
  };

  return (
    <div className='mx-auto max-w-xl space-y-6 p-8'>
      <h1 className='text-2xl font-bold'>Sentry Test Page</h1>
      <p className='text-sm text-muted-foreground'>
        Use these buttons to trigger errors and verify they appear in Sentry.
      </p>

      <div className='space-y-3'>
        <ErrorBoundaryTest />

        <button
          type='button'
          onClick={triggerUnhandledError}
          className='w-full rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700'
        >
          2. Unhandled Error (auto-captured by SDK)
        </button>

        <button
          type='button'
          onClick={triggerUnhandledRejection}
          className='w-full rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700'
        >
          3. Unhandled Promise Rejection (auto-captured)
        </button>

        <button
          type='button'
          onClick={triggerCaptureException}
          className='w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700'
        >
          4. captureException with Context
        </button>

        <button
          type='button'
          onClick={triggerCaptureMessage}
          className='w-full rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700'
        >
          5. captureMessage (warning level)
        </button>

        <button
          type='button'
          onClick={triggerServerActionError}
          className='w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
        >
          6. Server Action Error (onRequestError)
        </button>
      </div>

      {status && (
        <pre className='overflow-auto rounded bg-muted p-3 text-xs whitespace-pre-wrap'>
          {status}
        </pre>
      )}

      <div className='border-t pt-4 text-xs text-gray-500'>
        <p className='font-semibold'>What to check after clicking:</p>
        <ul className='mt-1 list-inside list-disc space-y-1'>
          <li>Sentry Dashboard → jobstash/webapp → Issues</li>
          <li>Slack channel linked to Sentry alerts</li>
        </ul>
      </div>
    </div>
  );
};
