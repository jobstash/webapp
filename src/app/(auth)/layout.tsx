import { PrivyClientProvider } from '@/components/providers/privy-provider.lazy';

const AuthLayout = ({ children }: React.PropsWithChildren) => (
  <PrivyClientProvider>{children}</PrivyClientProvider>
);

export default AuthLayout;
