'use client';

import { Button } from '@/lib/shared/ui/base/button';

import { ProfilePage } from './profile.page';
import { RequiredInfoPage } from './required-info.page';
import { UploadCvPage } from './upload-cv.page';

import {
  useProfileEntrypointActorRef,
  useProfileEntrypointSelector,
} from '@/lib/profile/providers/profile-entrypoint-machine.provider';
import { InternalErrorPage } from '@/lib/shared/pages/internal-error.page';
import { LoadingPage } from '@/lib/shared/pages/loading.page';

const LOADING_STATES = ['checkingProfile', 'decideNextStep'] as const;

export const ProfileEntrypointPage = () => {
  const profileEntrypointActorRef = useProfileEntrypointActorRef();
  const {
    isLoading,
    showUploadCvPage,
    showRequiredInfoPage,
    showErrorPage,
    isProcessingCV,
    isProcessingRequiredInfo,
    isReady,
  } = useProfileEntrypointSelector((snapshot) => {
    return {
      isLoading: LOADING_STATES.some((state) => snapshot.matches(state)),
      showUploadCvPage: snapshot.matches('uploadScreen'),
      showRequiredInfoPage: snapshot.matches('requiredInfoScreen'),
      showErrorPage: snapshot.matches('errorScreen'),
      isProcessingCV: snapshot.matches('processingCV'),
      isProcessingRequiredInfo: snapshot.matches('processingRequiredInfo'),
      isReady: snapshot.matches('ready'),
      value: snapshot.value,
    };
  });

  if (isLoading) return <LoadingPage />;
  if (isReady) return <ProfilePage />;
  if (showUploadCvPage) return <UploadCvPage />;
  if (showRequiredInfoPage) return <RequiredInfoPage />;
  if (showErrorPage) {
    return (
      <InternalErrorPage
        cta={
          <Button onClick={() => profileEntrypointActorRef.send({ type: 'RETRY' })}>
            Try again
          </Button>
        }
      />
    );
  }

  if (isProcessingCV) {
    return <div>Processing CV...</div>;
  }

  if (isProcessingRequiredInfo) {
    return <div>Processing Required Info...</div>;
  }

  return (
    <InternalErrorPage
      cta={<Button onClick={() => window.location.reload()}>Reload Page</Button>}
    />
  );
};
