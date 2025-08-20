import { Button } from '@/lib/shared/ui/base/button';

import { useProfileEntrypointActorRef } from '@/lib/profile/providers';

export const UploadCvPage = () => {
  const profileEntrypointActorRef = useProfileEntrypointActorRef();

  const handleSkipUpload = () => {
    profileEntrypointActorRef.send({ type: 'SKIP_UPLOAD' });
  };

  const handleUpload = () => {
    profileEntrypointActorRef.send({ type: 'UPLOAD' });
  };

  return (
    <div className='flex flex-col gap-8 p-4'>
      <div>Upload your CV</div>
      <Button onClick={handleSkipUpload}>Skip</Button>
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};
