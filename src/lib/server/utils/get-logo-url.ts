import 'server-only';

const getWebsiteText = (website: string | null) => {
  if (!website) return { link: '', hostname: '' };

  const isUrl = website.startsWith('http');
  const url = new URL(isUrl ? website : `https://${website}`);

  return {
    link: url.toString(),
    hostname: url.hostname,
  };
};

const URL_PREFIX = 'https://www.google.com/s2/favicons?domain=';
const URL_SUFFIX = '&sz=64';

const getGoogleLogoUrl = (url: string | null) =>
  `${URL_PREFIX}${getWebsiteText(url).hostname}${URL_SUFFIX}`;

export const getLogoUrl = (url: string | null, logo?: string | null) => {
  if (!url && !logo) return '';
  const hasLogo = logo && logo.trim().length > 0;
  return hasLogo ? logo : getGoogleLogoUrl(url);
};
