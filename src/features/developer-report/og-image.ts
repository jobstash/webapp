const DEVELOPER_REPORT_OG_VERSION = '20260815';

export const developerReportOgImage = (
  baseUrl: string,
  title: string,
  searchParams: URLSearchParams,
) => {
  const imageParams = new URLSearchParams(searchParams);
  imageParams.set('v', DEVELOPER_REPORT_OG_VERSION);

  return {
    url: `${baseUrl}/og?${imageParams.toString()}`,
    width: 1200,
    height: 630,
    type: 'image/png',
    alt: `${title} — JobStash`,
  };
};
