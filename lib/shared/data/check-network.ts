import { kyFetch } from './ky-fetch';

export const checkNetwork = async () => {
  if (navigator.onLine) {
    try {
      await kyFetch.head('/api/health', { cache: 'no-cache' });
      return true;
    } catch {
      throw new Error('Server is not reachable');
    }
  }
  throw new Error('No internet connection');
};
