import { useQuery } from '@tanstack/react-query';

import { PROFILE_QUERIES } from '@/lib/profile/core/queries';

export const useProfileInfo = () => {
  return useQuery(PROFILE_QUERIES.info());
};
