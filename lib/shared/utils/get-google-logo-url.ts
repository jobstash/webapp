import { ENV } from '@/lib/shared/core/envs';

import { getWebsiteText } from './get-website-text';

const URL_PREFIX = 'https://www.google.com/s2/favicons?domain=';
const URL_SUFFIX = '&sz=64';

export const getGoogleLogoUrl = (url: string | null) =>
  `${URL_PREFIX}${getWebsiteText(url).hostname}${URL_SUFFIX}`;

export const getLogoUrlHttpsAlternative = (googleString: string) => {
  const url = new URL(
    `${googleString.startsWith('http') ? '' : ENV.FRONTEND_URL}${googleString}`,
  );
  const domain = url.searchParams.get('domain');

  return `${URL_PREFIX}https://${domain}${URL_SUFFIX}`;
};
