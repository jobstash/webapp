import { AuthProviders } from '@/components/providers/auth-providers';

const OnboardingLayout = ({ children }: React.PropsWithChildren) => {
  return <AuthProviders>{children}</AuthProviders>;
};

export default OnboardingLayout;
