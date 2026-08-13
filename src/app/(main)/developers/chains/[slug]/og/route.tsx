import { renderDeveloperReportOg } from '@/features/developer-report/server/og';
import { fetchDeveloperReport } from '@/features/developer-report/server';

export const runtime = 'nodejs';

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) => {
  const { slug } = await params;
  const report = await fetchDeveloperReport(null, slug);
  return renderDeveloperReportOg(report, report?.scope.label ?? slug);
};
