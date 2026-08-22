import { renderDeveloperReportOg } from '@/features/developer-report/server/og';
import { fetchDeveloperReport } from '@/features/developer-report/server';
import type { DeveloperReportRange } from '@/features/developer-report/schemas';

export const runtime = 'nodejs';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) => {
  const { slug } = await params;
  const search = new URL(request.url).searchParams;
  const rawRange = search.get('range');
  const range: DeveloperReportRange =
    rawRange === '3m' ||
    rawRange === '6m' ||
    rawRange === '1y' ||
    rawRange === '3y'
      ? rawRange
      : 'max';
  const rawVertical = search.get('vertical');
  const vertical =
    rawVertical && /^[a-z0-9][a-z0-9_-]{0,119}$/.test(rawVertical)
      ? rawVertical
      : undefined;
  const report = await fetchDeveloperReport(vertical, slug, range);
  return renderDeveloperReportOg(report, report?.scope.label ?? slug);
};
