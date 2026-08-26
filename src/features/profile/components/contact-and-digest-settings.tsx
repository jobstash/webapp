'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useLinkAccount, usePrivy } from '@privy-io/react-auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2Icon,
  FileTextIcon,
  LoaderIcon,
  MailIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/hooks/use-session';
import { createSession } from '@/features/auth/lib/create-session';
import { emailDigestStateSchema } from '@/features/profile/email-digest';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';

import { useProfileEditor } from './profile-editor-provider';
import { ProfileCard } from './profile-card';

const EMAIL_DIGEST_KEY = ['profile-email-digest'] as const;

const fetchState = async () => {
  const response = await fetch('/api/profile/email-digest', {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Could not load email settings');
  return emailDigestStateSchema.parse(await response.json());
};

const Status = ({ complete, text }: { complete: boolean; text: string }) => (
  <span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
    {complete && <CheckCircle2Icon className='size-3.5 text-emerald-400' />}
    {text}
  </span>
);

const SettingRow = ({
  icon: Icon,
  title,
  label,
  status,
  action,
}: {
  icon: typeof MailIcon;
  title: string;
  label: string;
  status: React.ReactNode;
  action: React.ReactNode;
}) => (
  <div className='flex flex-col gap-3 rounded-xl border border-neutral-800/70 p-3 sm:flex-row sm:items-center sm:justify-between'>
    <div className='flex min-w-0 items-start gap-3'>
      <div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent'>
        <Icon className='size-4 text-muted-foreground' />
      </div>
      <div className='min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>{title}</span>
          <span className='rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase'>
            {label}
          </span>
        </div>
        {status}
      </div>
    </div>
    {action}
  </div>
);

export const ContactAndDigestSettings = () => {
  const queryClient = useQueryClient();
  const { isSessionReady } = useSession();
  const { user, getAccessToken } = usePrivy();
  const { openResumeUpload } = useProfileEditor();
  const { data: showcase } = useProfileShowcase(isSessionReady);
  const [error, setError] = useState<string | null>(null);
  const syncAttempted = useRef(false);
  const state = useQuery({
    queryKey: EMAIL_DIGEST_KEY,
    queryFn: fetchState,
    enabled: isSessionReady,
  });

  const linkedEmail = user?.linkedAccounts.some((account) => {
    if (account.type === 'email') return Boolean(account.address);
    if (
      account.type === 'google_oauth' ||
      account.type === 'apple_oauth' ||
      account.type === 'github_oauth'
    ) {
      return Boolean(account.email);
    }
    return false;
  });

  const syncContact = useCallback(async () => {
    const accessToken = await getAccessToken();
    if (accessToken) await createSession(accessToken);
    await queryClient.invalidateQueries({ queryKey: EMAIL_DIGEST_KEY });
  }, [getAccessToken, queryClient]);

  const { linkEmail } = useLinkAccount({
    onSuccess: () => {
      setError(null);
      void syncContact().catch(() =>
        setError('Email linked. Refresh if its status does not update.'),
      );
    },
    onError: () => setError('Email was not linked.'),
  });

  useEffect(() => {
    if (
      syncAttempted.current ||
      state.isPending ||
      state.data?.email ||
      !linkedEmail
    ) {
      return;
    }
    syncAttempted.current = true;
    void syncContact().catch(() => undefined);
  }, [linkedEmail, state.data?.email, state.isPending, syncContact]);

  const requestDigest = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/profile/email-digest', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Could not send confirmation');
      return emailDigestStateSchema.parse(await response.json());
    },
    onSuccess: (value) => {
      setError(null);
      queryClient.setQueryData(EMAIL_DIGEST_KEY, value);
    },
    onError: () => setError('Could not send confirmation.'),
  });
  const stopDigest = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/profile/email-digest', {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Could not update weekly email');
    },
    onSuccess: () => {
      setError(null);
      void queryClient.invalidateQueries({ queryKey: EMAIL_DIGEST_KEY });
    },
    onError: () => setError('Could not update weekly email.'),
  });

  const email = state.data?.email ?? null;
  const hasResume = (showcase ?? []).some((item) => item.label === 'CV');
  const digestStatus = state.data?.status ?? 'off';
  const digestWorking = requestDigest.isPending || stopDigest.isPending;

  return (
    <div className='flex flex-col gap-4'>
      <ProfileCard title='Recruiter contact'>
        <p className='mb-3 text-sm text-muted-foreground'>Be contactable.</p>
        <div className='flex flex-col gap-2'>
          <SettingRow
            icon={MailIcon}
            title='Email'
            label='Required'
            status={
              state.isPending ? (
                <Status complete={false} text='Checking…' />
              ) : (
                <Status complete={Boolean(email)} text={email ?? 'Missing'} />
              )
            }
            action={
              email ? null : (
                <Button size='sm' onClick={() => linkEmail()}>
                  Add email
                </Button>
              )
            }
          />
          <SettingRow
            icon={FileTextIcon}
            title='CV'
            label='Recommended'
            status={
              <Status
                complete={hasResume}
                text={
                  hasResume ? 'Ready for recruiters' : 'Add your work history'
                }
              />
            }
            action={
              <Button size='sm' variant='secondary' onClick={openResumeUpload}>
                {hasResume ? 'Replace' : 'Add CV'}
              </Button>
            }
          />
        </div>
      </ProfileCard>

      <ProfileCard title='Weekly job email'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-sm text-muted-foreground'>
              Fresh matches, once a week.
            </p>
            {digestStatus === 'pending' && (
              <p className='mt-1 text-xs text-amber-400'>Check your email.</p>
            )}
            {digestStatus === 'subscribed' && (
              <p className='mt-1 text-xs text-emerald-400'>Confirmed</p>
            )}
          </div>
          {digestStatus === 'subscribed' ? (
            <Button
              size='sm'
              variant='secondary'
              disabled={digestWorking}
              onClick={() => stopDigest.mutate()}
            >
              {stopDigest.isPending && (
                <LoaderIcon className='size-4 animate-spin' />
              )}
              Turn off
            </Button>
          ) : (
            <Button
              size='sm'
              disabled={!email || digestWorking}
              onClick={() => requestDigest.mutate()}
            >
              {requestDigest.isPending && (
                <LoaderIcon className='size-4 animate-spin' />
              )}
              {digestStatus === 'pending' ? 'Send again' : 'Turn on'}
            </Button>
          )}
        </div>
        {!email && (
          <p className='mt-2 text-xs text-muted-foreground'>
            Add an email first.
          </p>
        )}
        {error && <p className='mt-2 text-xs text-destructive'>{error}</p>}
      </ProfileCard>
    </div>
  );
};
