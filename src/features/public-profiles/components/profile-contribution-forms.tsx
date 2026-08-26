'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { FlagIcon, Loader2Icon, MessageSquareTextIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from '@/features/auth/hooks/use-session';
import type { PublicProfile } from '../schemas';

const fieldClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm';

const responseMessage = async (response: Response): Promise<string> => {
  const body = (await response.json().catch(() => null)) as {
    message?: string;
    error?: string;
  } | null;
  return body?.message ?? body?.error ?? 'The request could not be saved';
};

const LoginRequired = () => (
  <p className='text-sm text-muted-foreground'>
    <Link href='/login' className='font-medium text-foreground underline'>
      Log in
    </Link>{' '}
    to submit verified experience or report recruiter impersonation.
  </p>
);

export const ProfileContributionForms = ({
  profile,
}: {
  profile: PublicProfile;
}) => {
  const { isAuthenticated, isLoading } = useSession();
  const organizations = profile.children.filter(
    (child) => child.type === 'organization' && child.id,
  );
  const reportTargets = profile.children.filter((child) => child.id);
  const [reviewPending, setReviewPending] = useState(false);
  const [casePending, setCasePending] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [caseMessage, setCaseMessage] = useState<string | null>(null);

  const submitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setReviewPending(true);
    setReviewMessage(null);
    const salaryText = String(form.get('salary') ?? '').trim();
    const response = await fetch(
      `/api/profiles/${encodeURIComponent(profile.canonicalSlug)}/reviews`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: String(form.get('childId') ?? ''),
          rating: Number(form.get('rating')),
          reviewText: String(form.get('reviewText') ?? '').trim(),
          salary: salaryText ? Number(salaryText) : null,
          currency: salaryText
            ? String(form.get('currency') ?? '')
                .trim()
                .toUpperCase()
            : null,
          offersTokenAllocation: form.get('offersTokenAllocation') === 'on',
        }),
      },
    );
    const message = await responseMessage(response);
    setReviewPending(false);
    setReviewMessage(message);
    if (!response.ok) return;
    formElement.reset();
  };

  const submitCase = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setCasePending(true);
    setCaseMessage(null);
    const childId = String(form.get('childId') ?? '').trim();
    const recruiterContact = String(form.get('recruiterContact') ?? '').trim();
    const evidenceUrl = String(form.get('evidenceUrl') ?? '').trim();
    const response = await fetch(
      `/api/profiles/${encodeURIComponent(profile.canonicalSlug)}/cases`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: childId || null,
          allegation: {
            category: String(form.get('category') ?? 'other'),
            recruiterContact: recruiterContact || null,
            evidenceUrl: evidenceUrl || null,
            details: String(form.get('details') ?? '').trim(),
          },
        }),
      },
    );
    const message = await responseMessage(response);
    setCasePending(false);
    setCaseMessage(message);
    if (!response.ok) return;
    formElement.reset();
  };

  return (
    <section className='rounded-2xl border border-border/60 bg-card/60 p-5'>
      <h2 className='text-lg font-semibold'>Community reports</h2>
      <p className='mt-1 text-sm text-muted-foreground'>
        Organization reviews require an existing verified employment record.
        Recruiter reports remain private until a super-admin investigates and
        decides the case.
      </p>
      {isLoading ? (
        <p className='mt-4 text-sm text-muted-foreground'>Checking session…</p>
      ) : !isAuthenticated ? (
        <div className='mt-4'>
          <LoginRequired />
        </div>
      ) : (
        <div className='mt-4 grid gap-4 lg:grid-cols-2'>
          {organizations.length > 0 && (
            <details className='rounded-xl border border-border/60 p-4'>
              <summary className='flex cursor-pointer items-center gap-2 font-medium'>
                <MessageSquareTextIcon className='size-4' /> Review an
                organization
              </summary>
              <form className='mt-4 space-y-3' onSubmit={submitReview}>
                <label className='block text-sm'>
                  Organization
                  <select name='childId' required className={fieldClass}>
                    {organizations.map((child) => (
                      <option key={child.id} value={child.id ?? ''}>
                        {child.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className='block text-sm'>
                  Rating
                  <select name='rating' required className={fieldClass}>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} / 5
                      </option>
                    ))}
                  </select>
                </label>
                <label htmlFor='profile-review-text' className='block text-sm'>
                  Review
                  <Textarea
                    id='profile-review-text'
                    name='reviewText'
                    minLength={1}
                    maxLength={4000}
                    required
                  />
                </label>
                <div className='grid grid-cols-[1fr_6rem] gap-2'>
                  <label
                    htmlFor='profile-review-salary'
                    className='block text-sm'
                  >
                    Salary (optional)
                    <Input
                      id='profile-review-salary'
                      name='salary'
                      type='number'
                      min={0}
                    />
                  </label>
                  <label
                    htmlFor='profile-review-currency'
                    className='block text-sm'
                  >
                    Currency
                    <Input
                      id='profile-review-currency'
                      name='currency'
                      maxLength={3}
                      placeholder='USD'
                    />
                  </label>
                </div>
                <label className='flex items-center gap-2 text-sm'>
                  <input name='offersTokenAllocation' type='checkbox' />
                  Token allocation was offered
                </label>
                <Button type='submit' disabled={reviewPending}>
                  {reviewPending && <Loader2Icon className='animate-spin' />}
                  Submit for moderation
                </Button>
                {reviewMessage && (
                  <p className='text-sm text-muted-foreground' role='status'>
                    {reviewMessage}
                  </p>
                )}
              </form>
            </details>
          )}

          <details className='rounded-xl border border-amber-500/30 p-4'>
            <summary className='flex cursor-pointer items-center gap-2 font-medium'>
              <FlagIcon className='size-4' /> Report a fake recruiter
            </summary>
            <form className='mt-4 space-y-3' onSubmit={submitCase}>
              <label className='block text-sm'>
                Related organization or project
                <select name='childId' className={fieldClass} defaultValue=''>
                  <option value=''>The whole profile</option>
                  {reportTargets.map((child) => (
                    <option
                      key={`${child.type}-${child.id}`}
                      value={child.id ?? ''}
                    >
                      {child.name} ({child.type})
                    </option>
                  ))}
                </select>
              </label>
              <label className='block text-sm'>
                Problem
                <select name='category' required className={fieldClass}>
                  <option value='impersonation'>Recruiter impersonation</option>
                  <option value='payment_request'>Payment requested</option>
                  <option value='phishing'>Phishing or credential theft</option>
                  <option value='identity_misrepresentation'>
                    False identity
                  </option>
                  <option value='other'>Other</option>
                </select>
              </label>
              <label
                htmlFor='recruiter-report-contact'
                className='block text-sm'
              >
                Recruiter contact (optional)
                <Input
                  id='recruiter-report-contact'
                  name='recruiterContact'
                  maxLength={500}
                />
              </label>
              <label
                htmlFor='recruiter-report-evidence'
                className='block text-sm'
              >
                Evidence link (optional)
                <Input
                  id='recruiter-report-evidence'
                  name='evidenceUrl'
                  type='url'
                />
              </label>
              <label
                htmlFor='recruiter-report-details'
                className='block text-sm'
              >
                What happened?
                <Textarea
                  id='recruiter-report-details'
                  name='details'
                  minLength={1}
                  maxLength={4000}
                  required
                />
              </label>
              <Button type='submit' variant='outline' disabled={casePending}>
                {casePending && <Loader2Icon className='animate-spin' />}
                Submit private report
              </Button>
              {caseMessage && (
                <p className='text-sm text-muted-foreground' role='status'>
                  {caseMessage}
                </p>
              )}
            </form>
          </details>
        </div>
      )}
    </section>
  );
};

export const NoticeAppealForm = ({ noticeId }: { noticeId: string }) => {
  const { isAuthenticated, isLoading } = useSession();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setPending(true);
    setMessage(null);
    const response = await fetch(
      `/api/profiles/notices/${encodeURIComponent(noticeId)}/appeals`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appealText: String(form.get('appealText') ?? '').trim(),
        }),
      },
    );
    const responseText = await responseMessage(response);
    setPending(false);
    setMessage(responseText);
    if (!response.ok) return;
    formElement.reset();
  };

  if (isLoading) return null;
  if (!isAuthenticated) {
    return (
      <Link href='/login' className='mt-3 inline-block text-xs underline'>
        Log in to appeal this notice
      </Link>
    );
  }
  return (
    <details className='mt-3 text-sm'>
      <summary className='cursor-pointer font-medium'>
        Appeal this notice
      </summary>
      <form className='mt-2 space-y-2' onSubmit={submit}>
        <Textarea
          name='appealText'
          minLength={10}
          maxLength={4000}
          required
          placeholder='Explain what is incorrect and provide enough detail for review.'
        />
        <Button type='submit' size='sm' variant='outline' disabled={pending}>
          {pending && <Loader2Icon className='animate-spin' />}
          Submit appeal
        </Button>
        {message && (
          <p className='text-xs text-muted-foreground' role='status'>
            {message}
          </p>
        )}
      </form>
    </details>
  );
};
