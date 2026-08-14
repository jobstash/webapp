import { renderDeveloperReportOg } from '@/features/developer-report/server/og';
import { fetchDeveloperReport } from '@/features/developer-report/server';
import type { DeveloperReportRange } from '@/features/developer-report/schemas';

export const runtime = 'nodejs';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) => {
  const { slug } = await params;
  const rawRange = new URL(request.url).searchParams.get('range');
  const range: DeveloperReportRange =
    rawRange === '1y' || rawRange === '3y' ? rawRange : 'all';
  const report = await fetchDeveloperReport(null, slug, range);
  return renderDeveloperReportOg(report, report?.scope.label ?? slug);
};
