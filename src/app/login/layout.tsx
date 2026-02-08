import { AuthProviders } from '@/components/providers/auth-providers';

const LoginLayout = ({ children }: React.PropsWithChildren) => {
  return <AuthProviders>{children}</AuthProviders>;
};

export default LoginLayout;
