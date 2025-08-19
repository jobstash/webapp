'use client';

import { AuthMachineProvider } from './auth-machine.provider';
import { PrivyProvider } from './privy-provider';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider>
      <AuthMachineProvider>{children}</AuthMachineProvider>
    </PrivyProvider>
  );
};
