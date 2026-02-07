import { SessionRedirect } from '@/features/auth/components/session-redirect';
import { OnboardingContent } from '@/features/onboarding/components/onboarding-content';

const OnboardingPage = () => (
  <SessionRedirect>
    <OnboardingContent />
  </SessionRedirect>
);

export default OnboardingPage;
