'use client';

import { ThemeProvider } from './theme-provider';

export const RootProviders = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='dark' disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
};
