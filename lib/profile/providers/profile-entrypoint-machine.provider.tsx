import { useCallback, useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { createActorContext } from '@xstate/react';
import { fromPromise } from 'xstate';

import { PROFILE_QUERIES } from '@/lib/profile/core/queries';

import { processRequiredInfo } from '@/lib/profile/data';
import { processCV } from '@/lib/profile/data/process-cv';

import { profileEntrypointMachine } from '@/lib/profile/machines/profile-entrypoint.machine';

export const ProfileEntrypointMachineContext = createActorContext(
  profileEntrypointMachine,
);

export const ProfileEntrypointMachineProvider = ({
  children,
}: React.PropsWithChildren) => {
  const queryClient = useQueryClient();

  const checkProfileEntryFn = useCallback(async () => {
    try {
      return queryClient.fetchQuery(PROFILE_QUERIES.checkProfileEntry());
    } catch (error) {
      // TODO: log error, send to sentry
      console.error('Error checking profile entry', error);
      throw error;
    }
  }, [queryClient]);

  const processCVFn = useCallback(async () => {
    try {
      const result = await processCV();
      return result;
    } catch (error) {
      // TODO: log error, send to sentry
      console.error('Error processing CV', error);
      throw error;
    }
  }, []);

  const processRequiredInfoFn = useCallback(async () => {
    try {
      const result = await processRequiredInfo();
      return result;
    } catch (error) {
      // TODO: log error, send to sentry
      console.error('Error processing required info', error);
      throw error;
    }
  }, []);

  const configuredMachine = useMemo(() => {
    return profileEntrypointMachine.provide({
      actors: {
        checkProfileEntry: fromPromise(checkProfileEntryFn),
        processCV: fromPromise(processCVFn),
        processRequiredInfo: fromPromise(processRequiredInfoFn),
      },
    });
  }, [checkProfileEntryFn, processCVFn, processRequiredInfoFn]);

  return (
    <ProfileEntrypointMachineContext.Provider logic={configuredMachine}>
      {children}
    </ProfileEntrypointMachineContext.Provider>
  );
};

export const useProfileEntrypointSelector = ProfileEntrypointMachineContext.useSelector;
export const useProfileEntrypointActorRef = ProfileEntrypointMachineContext.useActorRef;
