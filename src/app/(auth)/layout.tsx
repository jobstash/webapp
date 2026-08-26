import { PrivyClientProvider } from '@/components/providers/privy-provider.lazy';
import { RequiredEmailGate } from '@/features/auth/components/required-email-gate';

const AuthLayout = ({ children }: React.PropsWithChildren) => (
  <PrivyClientProvider>
    <RequiredEmailGate>{children}</RequiredEmailGate>
  </PrivyClientProvider>
);

export default AuthLayout;
