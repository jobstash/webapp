import '../app/globals.css';

import React from 'react';

import type { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';

import { SWRConfig } from 'swr';

import { grotesk, interTight } from '../lib/shared/core/fonts';

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
          <SWRConfig
            value={{
              provider: () => new Map(),
            }}
          >
            <Story />
          </SWRConfig>
        </div>
      );
    },
  ],

  // tags: ['autodocs'],
};

export default preview;
