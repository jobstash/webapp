import { REMOTE_FILTERS } from '@/features/filters/constants';

export const getRemoteFilterEndpoint = (paramKey: string) => {
  const endpointUrl = REMOTE_FILTERS[paramKey as keyof typeof REMOTE_FILTERS];
  return (query: string) => `${endpointUrl}?query=${query}`;
};
