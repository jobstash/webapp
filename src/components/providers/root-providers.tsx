'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ProgressProvider } from '@bprogress/next/app';
import { Progress, Bar } from '@bprogress/next';

import { PrivyClientProvider } from './privy-provider';
import { ReactQueryProvider } from './react-query-provider';

export const RootProviders = ({ children }: React.PropsWithChildren) => {
  return (
    <PrivyClientProvider>
      <NuqsAdapter defaultOptions={{ shallow: false }}>
        <ReactQueryProvider>
          <ProgressProvider
            shallowRouting
            options={{ showSpinner: false, template: null }}
          >
            <div className='fixed inset-x-0 top-0 z-50 h-1 overflow-hidden'>
              <Progress>
                <Bar className='absolute! top-0! bg-linear-to-r! from-[#D68800]! to-[#8743FF]!' />
              </Progress>
            </div>
            {children}
          </ProgressProvider>
        </ReactQueryProvider>
      </NuqsAdapter>
    </PrivyClientProvider>
  );
};
