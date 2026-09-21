'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from '@bprogress/next/app';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useProfileEditor } from './profile-editor-provider';
import { COMPLETENESS_ITEMS } from '../constants';
import { useProfileCompleteness } from '../hooks/use-profile-completeness';
import { useProfileCompletionAction } from './profile-strength-card';
import {
  markSignInReturn,
  returnPageLabel,
  saveSignInReturn,
  readSignInReturn,
  safeReturnPath,
  type SignInReturn,
} from '@/features/auth/lib/return-navigation';

function Notice() {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const profile = useProfileCompleteness();
  const performAction = useProfileCompletionAction();
  const { isEditorOpen } = useProfileEditor();
  const returnButton = useRef<HTMLButtonElement>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [saved, setSaved] = useState<SignInReturn | null>(null);
  const redirect = params.get('redirect');
  const setup = params.get('setup') === '1';
  useEffect(() => {
    if (setup && redirect) markSignInReturn(safeReturnPath(redirect), 'setup');
    setSaved(
      readSignInReturn() ??
        (setup && redirect
          ? {
              href: safeReturnPath(redirect),
              label: returnPageLabel(redirect),
              x: 0,
              y: 0,
              phase: 'setup',
            }
          : null),
    );
  }, [pathname, redirect, setup]);
  const pendingReturn = saved?.phase === 'setup' ? saved : null;
  const settings = pathname === '/profile/settings';
  if (!pendingReturn && (!settings || profile.isComplete || profile.isPending))
    return null;
  const href = pendingReturn?.href ?? '/';
  // Returning to settings itself should not leave a permanent setup loop.
  const destination =
    href.split(/[?#]/)[0] === '/profile/settings' ? '/' : href;
  const label =
    destination === '/'
      ? 'Continue browsing'
      : returnPageLabel(destination) === 'Back to job'
        ? 'Back to job'
        : (pendingReturn?.label ?? 'Back to previous page');
  const returnToPage = () => {
    setIsReturning(true);
    markSignInReturn(destination, 'returning');
    router.push(destination, { scroll: false });
  };
  const dismissPrompt = () => {
    if (!pendingReturn) return;
    const dismissed = { ...pendingReturn, completionPromptDismissed: true };
    saveSignInReturn(dismissed);
    setSaved(dismissed);
  };
  const showPrompt = Boolean(
    pendingReturn &&
    profile.isComplete &&
    !profile.isPending &&
    !profile.isError &&
    !isEditorOpen &&
    !pendingReturn.completionPromptDismissed &&
    !isReturning,
  );
  return (
    <>
      <section
        aria-label='Profile setup'
        className='flex flex-col gap-3 rounded-lg border border-[#8743FF]/50 bg-sidebar p-4'
      >
        <h2 className='font-semibold'>
          {profile.isComplete
            ? 'Your profile is complete'
            : 'Finish setting up your profile'}
        </h2>
        {profile.isError ? (
          <p role='alert' className='text-sm text-muted-foreground'>
            We couldn’t load your profile.{' '}
            <button type='button' className='underline' onClick={profile.retry}>
              Try again
            </button>
            .
          </p>
        ) : profile.isComplete ? (
          <p className='text-sm text-muted-foreground'>
            You’re All-Star. You can return to where you left off.
          </p>
        ) : (
          <p className='text-sm text-muted-foreground'>
            You’ll return to settings each time you sign in until your profile
            reaches All-Star. You can return to your previous page anytime.
          </p>
        )}
        {settings &&
          !profile.isComplete &&
          !profile.isPending &&
          !profile.isError && (
            <div className='flex flex-wrap gap-2'>
              {COMPLETENESS_ITEMS.filter(
                (item) => !profile.completionMap[item.key],
              ).map((item) => (
                <Button
                  key={item.key}
                  size='sm'
                  variant='outline'
                  onClick={() => performAction(item.ctaType)}
                >
                  {item.action}
                </Button>
              ))}
            </div>
          )}
        <Button
          className='w-fit bg-[#8743FF] text-white hover:bg-[#8743FF]/90'
          onClick={returnToPage}
          disabled={isReturning}
        >
          {label}
        </Button>
      </section>
      <Dialog
        open={showPrompt}
        onOpenChange={(open) => {
          if (!open && !isReturning) dismissPrompt();
        }}
      >
        <DialogContent
          className='border-[#8743FF]/50 bg-sidebar'
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            returnButton.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle>Your profile is ready</DialogTitle>
            <DialogDescription>
              {label === 'Back to job'
                ? 'Return to the job you were viewing to continue applying.'
                : 'Return to the page you were browsing and pick up where you left off.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={dismissPrompt}>
              Stay on my profile
            </Button>
            <Button
              ref={returnButton}
              className='bg-[#8743FF] text-white hover:bg-[#8743FF]/90'
              onClick={returnToPage}
              disabled={isReturning}
            >
              {label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const ProfileSetupNotice = () => (
  <Suspense>
    <Notice />
  </Suspense>
);
