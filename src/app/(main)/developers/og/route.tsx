import { fetchDeveloperReport } from '@/features/developer-report/server';
import { renderDeveloperReportOg } from '@/features/developer-report/server/og';
import type { DeveloperReportRange } from '@/features/developer-report/schemas';

export const runtime = 'nodejs';

const ranges: DeveloperReportRange[] = ['3m', '6m', '1y', '3y', 'max'];

export const GET = async (request: Request) => {
  const search = new URL(request.url).searchParams;
  const rawVertical = search.get('vertical');
  const vertical =
    rawVertical && /^[a-z0-9][a-z0-9_-]{0,119}$/.test(rawVertical)
      ? rawVertical
      : undefined;
  const rawRange = search.get('range');
  const range = ranges.includes(rawRange as DeveloperReportRange)
    ? (rawRange as DeveloperReportRange)
    : 'max';
  const report = await fetchDeveloperReport(vertical, undefined, range);
  return renderDeveloperReportOg(report, report?.scope.label ?? 'Ecosystem');
};
