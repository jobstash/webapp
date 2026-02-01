import { useEffect, useRef, useTransition } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from '@bprogress/next/app';

import { useLoginWithOAuth, usePrivy } from '@privy-io/react-auth';

import { useSession } from '@/features/auth/hooks/use-session';
import {
  useOnboarding,
  STEP_ORDER,
} from '@/features/onboarding/hooks/use-onboarding';
import { useOnboardingSync } from '@/features/onboarding/hooks/use-onboarding-sync';
import { GA_EVENT, trackEvent } from '@/lib/analytics';

const WelcomeStep = dynamic(() =>
  import('./steps/welcome-step').then((mod) => mod.WelcomeStep),
);
const ResumeStep = dynamic(() =>
  import('./steps/resume-step').then((mod) => mod.ResumeStep),
);
const SkillsStep = dynamic(() =>
  import('./steps/skills-step').then((mod) => mod.SkillsStep),
);
const ConnectStep = dynamic(() =>
  import('./steps/connect-step').then((mod) => mod.ConnectStep),
);

const STEP_COMPONENTS = {
  welcome: WelcomeStep,
  resume: ResumeStep,
  skills: SkillsStep,
  connect: ConnectStep,
} as const;

export const useOnboardingContent = () => {
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();
  const { ready, authenticated } = usePrivy();
  const { isSessionReady } = useSession();
  const { currentStep, isLoginView, data, reset } = useOnboarding();
  const { loading: isOAuthLoading } = useLoginWithOAuth();
  const { status: syncStatus, sync } = useOnboardingSync();

  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const StepComponent = STEP_COMPONENTS[currentStep];
  const isLoading =
    !ready ||
    isOAuthLoading ||
    authenticated ||
    (typeof window !== 'undefined' &&
      /[?&]privy_oauth_/.test(window.location.search));
  const isSyncing = syncStatus === 'syncing';

  const hasTrackedCompletion = useRef(false);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    if (!isLoading && !isLoginView) {
      trackEvent(GA_EVENT.ONBOARDING_STEP_VIEWED, {
        step_number: currentIndex + 1,
        step_name: currentStep,
      });
    }
  }, [currentStep, isLoading, isLoginView, currentIndex]);

  useEffect(() => {
    if (ready && authenticated && isSessionReady) {
      if (!hasTrackedCompletion.current) {
        hasTrackedCompletion.current = true;
        trackEvent(GA_EVENT.ONBOARDING_COMPLETED, {});
      }
      sync(data);
    }
  }, [ready, authenticated, isSessionReady, data, sync]);

  useEffect(() => {
    if (syncStatus === 'done') {
      startTransition(() => {
        router.replace('/profile');
      });
    }
  }, [syncStatus, router]);

  const handleClose = () => {
    startTransition(() => {
      router.push('/');
    });
  };

  return {
    steps: STEP_ORDER,
    currentIndex,
    isLoginView,
    isLoading,
    isSyncing,
    isNavigating,
    StepComponent,
    handleClose,
  };
};
