'use client';

import { useState } from 'react';

import { reportError } from '@/features/error-reporter/reporter';

export const TriggerError = () => {
  const [status, setStatus] = useState<string>('');

  const triggerClientReportedError = () => {
    setStatus(
      'Sending client error via reportError() → /api/error → Sentry...',
    );
    const error = new Error(
      `[Sentry Test] Client error at ${new Date().toISOString()}`,
    );
    error.name = 'SentryTestError';
    reportError(error);
    setStatus(
      'Client error sent via sendBeacon. Check /api/error logs and Sentry dashboard.',
    );
  };

  const triggerUnhandledError = () => {
    setStatus('Throwing unhandled error (caught by GlobalErrorSetup)...');
    setTimeout(() => {
      throw new Error(
        `[Sentry Test] Unhandled error at ${new Date().toISOString()}`,
      );
    }, 100);
  };

  const triggerUnhandledRejection = () => {
    setStatus('Triggering unhandled promise rejection...');
    Promise.reject(
      new Error(
        `[Sentry Test] Unhandled rejection at ${new Date().toISOString()}`,
      ),
    );
  };

  const triggerServerError = async () => {
    setStatus('Calling /api/sentry-test to trigger server-side error...');
    try {
      const res = await fetch('/api/sentry-test', { method: 'POST' });
      const data = await res.json();
      setStatus(`Server response: ${JSON.stringify(data)}`);
    } catch (e) {
      setStatus(`Fetch failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className='mx-auto max-w-xl space-y-6 p-8'>
      <h1 className='text-2xl font-bold'>Sentry Test Page</h1>
      <p className='text-sm text-muted-foreground'>
        Use these buttons to trigger errors and verify they appear in Sentry and
        Slack.
      </p>

      <div className='space-y-3'>
        <button
          type='button'
          onClick={triggerClientReportedError}
          className='w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
        >
          1. Client Error (via reportError → /api/error)
        </button>

        <button
          type='button'
          onClick={triggerUnhandledError}
          className='w-full rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700'
        >
          2. Unhandled Error (window.error → GlobalErrorSetup)
        </button>

        <button
          type='button'
          onClick={triggerUnhandledRejection}
          className='w-full rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700'
        >
          3. Unhandled Promise Rejection
        </button>

        <button
          type='button'
          onClick={triggerServerError}
          className='w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
        >
          4. Server-side Error (direct Sentry.captureException)
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
          <li>Server logs for &quot;[ErrorReporter]&quot; or Sentry errors</li>
          <li>Browser DevTools → Network tab → /api/error requests</li>
        </ul>
      </div>
    </div>
  );
};
