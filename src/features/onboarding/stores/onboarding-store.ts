import { create } from 'zustand';

import type {
  OnboardingData,
  OnboardingStep,
  ResumeData,
  UserSkill,
} from '@/features/onboarding/schemas';

export const STEP_ORDER: OnboardingStep[] = [
  'welcome',
  'resume',
  'skills',
  'connect',
];

const INITIAL_STATE = {
  currentStep: 'welcome' as OnboardingStep,
  isLoginView: false,
  data: {
    resumeFile: null,
    parsedResume: null,
    selectedSkills: [],
  } satisfies OnboardingData,
};

interface OnboardingStore {
  currentStep: OnboardingStep;
  isLoginView: boolean;
  data: OnboardingData;
  nextStep: () => void;
  prevStep: () => void;
  showLogin: () => void;
  hideLogin: () => void;
  setResumeFile: (file: File | null) => void;
  setParsedResume: (parsed: ResumeData | null) => void;
  setSelectedSkills: (skills: UserSkill[]) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()((set) => ({
  ...INITIAL_STATE,

  nextStep: () =>
    set((state) => {
      const i = STEP_ORDER.indexOf(state.currentStep);
      return i < STEP_ORDER.length - 1
        ? { currentStep: STEP_ORDER[i + 1] }
        : state;
    }),

  prevStep: () =>
    set((state) => {
      const i = STEP_ORDER.indexOf(state.currentStep);
      return i > 0 ? { currentStep: STEP_ORDER[i - 1] } : state;
    }),

  showLogin: () => set({ isLoginView: true }),
  hideLogin: () => set({ isLoginView: false }),

  setResumeFile: (resumeFile) =>
    set((state) => ({ data: { ...state.data, resumeFile } })),

  setParsedResume: (parsedResume) =>
    set((state) => ({ data: { ...state.data, parsedResume } })),

  setSelectedSkills: (selectedSkills) =>
    set((state) => ({ data: { ...state.data, selectedSkills } })),

  reset: () => set(INITIAL_STATE),
}));
