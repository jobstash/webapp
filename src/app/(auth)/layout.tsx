import { PrivyClientProvider } from '@/components/providers/privy-provider';

const AuthLayout = ({ children }: React.PropsWithChildren) => (
  <PrivyClientProvider>{children}</PrivyClientProvider>
);

export default AuthLayout;
