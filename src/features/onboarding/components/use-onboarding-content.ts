import { useEffect, useTransition } from 'react';

import { useRouter } from '@bprogress/next/app';

import { useLoginWithOAuth, usePrivy } from '@privy-io/react-auth';

import { useSession } from '@/features/auth/hooks/use-session';
import {
  useOnboarding,
  STEP_ORDER,
} from '@/features/onboarding/hooks/use-onboarding';

import { ConnectStep } from './steps/connect-step';
import { ResumeStep } from './steps/resume-step';
import { SkillsStep } from './steps/skills-step';
import { WelcomeStep } from './steps/welcome-step';

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
  const { currentStep, isLoginView, reset } = useOnboarding();
  const { loading: isOAuthLoading } = useLoginWithOAuth();

  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const StepComponent = STEP_COMPONENTS[currentStep];
  const hasOAuthParams =
    typeof window !== 'undefined' &&
    /[?&]privy_oauth_/.test(window.location.search);
  const isLoading = !ready || hasOAuthParams || isOAuthLoading || authenticated;

  // Reset onboarding state on mount (Zustand persists across SPA navigations)
  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    if (ready && authenticated && isSessionReady) {
      startTransition(() => {
        router.replace('/profile');
      });
    }
  }, [ready, authenticated, isSessionReady, router]);

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
    isNavigating,
    StepComponent,
    handleClose,
  };
};
