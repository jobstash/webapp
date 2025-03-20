import { getGoogleLogoUrl } from '@/lib/shared/utils/get-google-logo-url';

export const getLogoUrl = (url: string | null, logo?: string | null) => {
  if (!url && !logo) return '';
  const hasLogo = logo && logo.trim().length > 0;
  return hasLogo ? logo : getGoogleLogoUrl(url);
};
