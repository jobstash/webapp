'use client';

import { useId } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSession } from '@/features/auth/hooks/use-session';
import { availabilitySchema } from '@/features/profile/availability';

import { ProfileCard } from './profile-card';

const requestAvailability = async (availability?: boolean) => {
  const response = await fetch('/api/profile/availability', {
    cache: 'no-store',
    ...(availability !== undefined
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ availability }),
        }
      : {}),
  });
  if (!response.ok) throw new Error('Could not save talent pool settings');
  return availabilitySchema.parse(await response.json());
};

export const TalentPoolSetting = () => {
  const id = useId();
  const descriptionId = `${id}-description`;
  const { isSessionReady } = useSession();
  const { user } = usePrivy();
  const queryClient = useQueryClient();
  const queryKey = ['profile-availability', user?.id];
  const state = useQuery({
    queryKey,
    queryFn: () => requestAvailability(),
    enabled: isSessionReady,
    throwOnError: false,
  });
  const update = useMutation({
    mutationFn: requestAvailability,
    throwOnError: false,
    onSuccess: (value) => queryClient.setQueryData(queryKey, value),
  });

  return (
    <ProfileCard id='talent-pool' title='Talent pool'>
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <label htmlFor={id} className='text-sm font-medium'>
            Open to opportunities
          </label>
          <p id={descriptionId} className='mt-1 text-sm text-muted-foreground'>
            Join the talent pool so recruiters can find your profile and contact
            you about roles. Turn this off to hide your profile from talent pool
            searches.
          </p>
        </div>
        <Switch
          id={id}
          className='mt-0.5'
          aria-describedby={descriptionId}
          checked={state.data?.availableForWork ?? false}
          disabled={
            !isSessionReady || !state.data || state.isError || update.isPending
          }
          onCheckedChange={(available) => update.mutate(available)}
        />
      </div>
      {state.isError ? (
        <div className='mt-3 flex items-center gap-3'>
          <p role='alert' className='text-xs text-destructive'>
            Could not load your talent pool setting.
          </p>
          <Button
            size='sm'
            variant='secondary'
            onClick={() => void state.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : (
        <p role='status' className='mt-3 text-xs text-muted-foreground'>
          {update.isPending
            ? 'Saving…'
            : !state.data
              ? 'Loading…'
              : state.data.availableForWork
                ? 'Visible in the talent pool'
                : 'Hidden from the talent pool'}
        </p>
      )}
      {update.isError && (
        <p role='alert' className='mt-2 text-xs text-destructive'>
          Your change was not saved. Please try again.
        </p>
      )}
    </ProfileCard>
  );
};
