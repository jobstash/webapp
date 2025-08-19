'use client';

import { createContext } from 'react';

const AuthFallbackContext = createContext({
  isLoading: true,
  isAuthenticated: false,
  isProviderReady: false,
});

export const AuthFallbackProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthFallbackContext.Provider
      value={{
        isLoading: true,
        isAuthenticated: false,
        isProviderReady: false,
      }}
    >
      {children}
    </AuthFallbackContext.Provider>
  );
};
