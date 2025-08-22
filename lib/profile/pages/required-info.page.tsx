import { Button } from '@/lib/shared/ui/base/button';

import { useProfileEntrypointActorRef } from '@/lib/profile/providers/profile-entrypoint-machine.provider';

export const RequiredInfoPage = () => {
  const profileEntrypointActorRef = useProfileEntrypointActorRef();

  const handleSubmit = () => {
    profileEntrypointActorRef.send({ type: 'SUBMIT' });
  };
  return (
    <div className='flex flex-col gap-8 p-4'>
      <div>Required Info</div>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};
