import '../app/globals.css';

import React from 'react';

import type { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SWRConfig } from 'swr';

import { grotesk, interTight } from '../lib/shared/core/fonts';
import { ThemeProvider } from '../lib/shared/providers/theme-provider';

// MSW
initialize({
  onUnhandledRequest({ method, url }) {
    if (url.startsWith('/api')) {
      console.error(`Unhandled ${method} request to "${url}"`);
    }
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },

  loaders: [mswLoader],

  decorators: [
    (Story) => {
      return (
        <div className={`${interTight.variable} ${grotesk.variable} antialiased`}>
          <ThemeProvider attribute='class' defaultTheme='dark' disableTransitionOnChange>
            <NuqsAdapter>
              <SWRConfig
                value={{
                  provider: () => new Map(),
                }}
              >
                <div className='h-[100vh] overflow-auto'>
                  <Story />
                </div>
              </SWRConfig>
            </NuqsAdapter>
          </ThemeProvider>
        </div>
      );
    },
  ],

  // tags: ['autodocs'],
};

export default preview;
