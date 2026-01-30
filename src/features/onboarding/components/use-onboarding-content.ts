import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useLoginWithOAuth, usePrivy } from '@privy-io/react-auth';

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
  const { ready, authenticated } = usePrivy();
  const { currentStep, isLoginView, reset } = useOnboarding();

  const { loading: isOAuthLoading } = useLoginWithOAuth();

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    if (ready && authenticated) {
      router.replace('/profile');
    }
  }, [ready, authenticated, router]);

  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const StepComponent = STEP_COMPONENTS[currentStep];

  // Detect OAuth redirect params to cover the gap between SDK ready and hook processing
  const hasOAuthParams =
    typeof window !== 'undefined' &&
    /[?&](privy_oauth_code|privy_oauth_state)=/.test(window.location.search);
  const isLoading = !ready || hasOAuthParams || isOAuthLoading || authenticated;

  const handleClose = () => router.push('/');

  return {
    steps: STEP_ORDER,
    currentIndex,
    isLoginView,
    isLoading,
    StepComponent,
    handleClose,
  };
};
