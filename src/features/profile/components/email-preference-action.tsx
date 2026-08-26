'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { CheckCircle2Icon, LoaderIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface EmailPreferenceActionProps {
  action: 'confirm' | 'unsubscribe';
}

export const EmailPreferenceAction = ({
  action,
}: EmailPreferenceActionProps) => {
  const token = useSearchParams().get('token');
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'error'>(
    'idle',
  );
  const isConfirm = action === 'confirm';

  const submit = async () => {
    if (!token) return setState('error');
    setState('working');
    const response = await fetch(`/api/email-digest/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).catch(() => null);
    setState(response?.ok ? 'done' : 'error');
  };

  if (state === 'done') {
    return (
      <div className='flex flex-col items-center gap-4 text-center'>
        <CheckCircle2Icon className='size-10 text-emerald-400' />
        <div>
          <h1 className='text-2xl font-semibold'>
            {isConfirm ? 'Weekly email is on' : 'Weekly email is off'}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            {isConfirm ? 'Fresh matches, once a week.' : 'No more digests.'}
          </p>
        </div>
        <Button asChild variant='secondary'>
          <Link href={isConfirm ? '/profile/jobs' : '/'}>
            {isConfirm ? 'See my jobs' : 'Back to JobStash'}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center gap-4 text-center'>
      <div>
        <h1 className='text-2xl font-semibold'>
          {isConfirm ? 'Weekly job email' : 'Stop weekly emails'}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          {isConfirm
            ? 'Confirm fresh matches, once a week.'
            : 'You can turn this on again later.'}
        </p>
      </div>
      {state === 'error' || !token ? (
        <p className='text-sm text-destructive'>
          This link is invalid or expired.
        </p>
      ) : null}
      <Button onClick={submit} disabled={!token || state === 'working'}>
        {state === 'working' && <LoaderIcon className='size-4 animate-spin' />}
        {isConfirm ? 'Confirm' : 'Stop emails'}
      </Button>
    </div>
  );
};
