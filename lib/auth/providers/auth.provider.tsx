import { createActorContext } from '@xstate/react';

import { authMachine } from '@/lib/auth/machines';

const AuthMachineContext = createActorContext(authMachine);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthMachineContext.Provider>{children}</AuthMachineContext.Provider>;
};

export const useAuthSelector = AuthMachineContext.useSelector;
export const useAuthActorRef = () => AuthMachineContext.useActorRef;
