import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const { currentStep, isLoginView, reset } = useOnboarding();

  useEffect(() => {
    reset();
  }, [reset]);

  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const StepComponent = STEP_COMPONENTS[currentStep];

  const handleClose = () => router.push('/');

  return {
    steps: STEP_ORDER,
    currentIndex,
    isLoginView,
    StepComponent,
    handleClose,
  };
};
