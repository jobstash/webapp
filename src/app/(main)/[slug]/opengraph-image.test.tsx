import { createServer } from 'node:http';
import type { Server } from 'node:http';
import type * as NextOg from 'next/og';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { fetchPillarJobCount } from '@/features/pillar/server/data/fetch-pillar-job-count';
import OpengraphImage, { dynamic } from './opengraph-image';
import TwitterImage, { dynamic as twitterDynamic } from './twitter-image';

const state = vi.hoisted(() => ({ origin: '', markup: '' }));
vi.mock('@/lib/env/client', () => ({
  clientEnv: {
    get MW_URL() {
      return state.origin;
    },
    get FRONTEND_URL() {
      return state.origin;
    },
  },
}));
vi.mock('next/cache', () => ({
  unstable_cache: (callback: unknown) => callback,
}));
vi.mock('@/features/jobs/server/data/fetch-jobs-revision', () => ({
  fetchJobsRevision: async () => 'fixture-revision',
}));
vi.mock('next/og', async (importOriginal) => {
  const original = await importOriginal<typeof NextOg>();
  return {
    ImageResponse: class extends original.ImageResponse {
      constructor(
        ...args: ConstructorParameters<typeof original.ImageResponse>
      ) {
        state.markup = renderToStaticMarkup(args[0]);
        super(...args);
      }
    },
  };
});

const cases = [
  [
    'o-fixture-company',
    'o-fixture-company',
    2,
    'Open Jobs at Fixture Company (2)',
  ],
  ['t-react', 't-react', 137, 'Open React Jobs (137)'],
  ['cl-engineering', 'cl-engineering', 21, 'Open Engineering Jobs (21)'],
  ['l-germany', 'l-germany', 7, 'Open Jobs in Germany (7)'],
  ['tz-utc-plus-1', 'tz-utc-plus-1', 6, 'Open Jobs in Utc Plus 1 (6)'],
  ['ct-utc-09', 'ct-utc-09', 5, 'Open 09:00 UTC Collaboration Jobs (5)'],
  ['co-full-time', 'co-full-time', 4, 'Open Full-Time Jobs (4)'],
  ['lt-fully-remote', 'lt-fully-remote', 3, 'Open Fully Remote Jobs (3)'],
  ['s-senior', 's-senior', 8, 'Open Senior Role Jobs (8)'],
  [
    'i-fixture-fund',
    'i-fixture-fund',
    9,
    'Open Jobs backed by Fixture Fund (9)',
  ],
  ['fr-seed', 'fr-seed', 10, 'Open Seed Funded Jobs (10)'],
  ['fs-series-a', 'fs-series-a', 11, 'Open Series A Startup Jobs (11)'],
  [
    'b-pays-in-crypto',
    'b-pays-in-crypto',
    12,
    'Open Jobs that pay in crypto (12)',
  ],
  ['urgently-hiring', 'b-expertJobs', 13, 'Open Urgently Hiring Jobs (13)'],
  [
    'crypto-beginner-jobs',
    'b-onboardIntoWeb3',
    1,
    'Open Crypto Beginner Jobs (1)',
  ],
  ['o-empty-company', 'o-empty-company', 0, 'Open Jobs at Empty Company (0)'],
  [
    'cl-forward-deployed-engineer',
    'cl-forward-deployed-engineer',
    0,
    'Open Forward Deployed Engineer Jobs (0)',
  ],
  [
    'o-fixture-company~123',
    'o-fixture-company~123',
    4,
    'Open Jobs at Fixture Company (4)',
  ],
] as const;

type FixtureJob = {
  pillar: string;
  online: boolean;
  blocked: boolean;
  published: string;
  latestImport: boolean;
};
const inventory: FixtureJob[] = cases.flatMap(([, pillar, count]) => [
  ...Array.from({ length: count }, () => ({
    pillar,
    online: true,
    blocked: false,
    published: '2020-01-01',
    latestImport: false,
  })),
  {
    pillar,
    online: false,
    blocked: false,
    published: '2026-01-01',
    latestImport: true,
  },
  {
    pillar,
    online: true,
    blocked: true,
    published: '2026-01-01',
    latestImport: true,
  },
  {
    pillar,
    online: true,
    blocked: false,
    published: '2099-01-01',
    latestImport: true,
  },
]);
const requests: URL[] = [];
let server: Server;
let countOverride: { totalJobs?: unknown } | undefined;
let feedStatus = 200;
let feedBody: string | undefined;
let closedPillar: string | undefined;

beforeAll(async () => {
  const logo = await readFile(join(process.cwd(), 'public/jobstash-logo.png'));
  server = createServer((req, res) => {
    const url = new URL(req.url!, state.origin);
    if (url.pathname === '/jobstash-logo.png') {
      res.writeHead(200, { 'Content-Type': 'image/png' }).end(logo);
      return;
    }
    requests.push(url);
    res.setHeader('Content-Type', 'application/json');
    if (url.pathname.startsWith('/search/pillar/page/static/')) {
      const pillar = decodeURIComponent(url.pathname.split('/').at(-1)!);
      const hasJobs = cases.some(
        ([, apiSlug, count]) => apiSlug === pillar && count > 0,
      );
      res.end(
        JSON.stringify({
          success: true,
          message: 'Synthetic metadata fixture',
          data: {
            title: 'Fixture pillar',
            description:
              'Deterministic open-job inventory for social-image regression coverage.',
            jobs: [],
            indexing: hasJobs ? 'index' : 'noindex',
            hasEligibleOpenJobs: hasJobs,
            organization: null,
            suggestedPillars: [],
          },
        }),
      );
      return;
    }
    if (url.pathname === '/jobs/feed') {
      if (feedBody !== undefined) {
        res.end(feedBody);
        return;
      }
      const pillar = url.searchParams.get('pillar');
      const eligible = inventory.filter(
        (job) =>
          (!pillar || job.pillar === pillar) &&
          job.pillar !== closedPillar &&
          job.online &&
          !job.blocked &&
          job.published <= '2026-11-06' &&
          (!url.searchParams.has('batch') || job.latestImport) &&
          (!url.searchParams.has('publicationDate') ||
            job.published >= '2026-08-06') &&
          (!url.searchParams.has('startDate') ||
            job.published >= url.searchParams.get('startDate')!),
      );
      // Group count and one returned preview deliberately differ from totalJobs.
      res.writeHead(feedStatus).end(
        JSON.stringify(
          countOverride ?? {
            page: 1,
            count: eligible.length ? 1 : 0,
            total: Math.min(2, eligible.length),
            totalJobs: eligible.length,
            mode: 'grouped',
            data: eligible.slice(0, 1),
          },
        ),
      );
      return;
    }
    res.writeHead(404).end('{}');
  });
  const listening = Promise.withResolvers<void>();
  server.listen(0, '127.0.0.1', listening.resolve);
  await listening.promise;
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Missing fixture port');
  state.origin = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  const closing = Promise.withResolvers<void>();
  server.close((error) => (error ? closing.reject(error) : closing.resolve()));
  await closing.promise;
});
beforeEach(() => {
  requests.length = 0;
  countOverride = undefined;
  feedStatus = 200;
  feedBody = undefined;
  closedPillar = undefined;
});

const visibleText = () =>
  state.markup
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const render = async (slug: string, image = OpengraphImage) => {
  const response = await image({ params: Promise.resolve({ slug }) });
  const png = Buffer.from(await response.arrayBuffer());
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toBe('image/png');
  expect(response.headers.get('cache-control')).not.toContain('immutable');
  expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
  expect(png.length).toBeGreaterThan(1000);
  return png;
};

describe('pillar social images from the visible feed inventory', () => {
  it.each(cases)(
    'renders %s with the authoritative total',
    async (slug, apiSlug, count, headline) => {
      const png = await render(slug);
      expect(visibleText()).toContain(headline);
      expect(visibleText()).not.toContain('New ');
      const metadataRequest = requests.find((url) =>
        url.pathname.includes('/page/static/'),
      )!;
      expect(metadataRequest.searchParams.get('metadataOnly')).toBe('true');
      const feedRequest = requests.find(
        (url) => url.pathname === '/jobs/feed',
      )!;
      expect(Object.fromEntries(feedRequest.searchParams)).toEqual({
        pillar: apiSlug,
        limit: '1',
      });
      expect(dynamic).toBe('force-dynamic');
      if (process.env.PILLAR_OG_EVIDENCE_DIR) {
        await mkdir(process.env.PILLAR_OG_EVIDENCE_DIR, { recursive: true });
        await writeFile(
          join(process.env.PILLAR_OG_EVIDENCE_DIR, `${slug}.png`),
          png,
        );
        await writeFile(
          join(process.env.PILLAR_OG_EVIDENCE_DIR, `${slug}.json`),
          JSON.stringify(
            {
              headline,
              totalJobs: count,
              metadataJobs: [],
              feedQuery: feedRequest.search,
              bytes: png.length,
            },
            null,
            2,
          ),
        );
      }
    },
  );

  it('changes the actual PNG after open jobs close, without waiting for metadata expiry', async () => {
    const before = await render('o-fixture-company');
    expect(visibleText()).toContain('Open Jobs at Fixture Company (2)');
    closedPillar = 'o-fixture-company';
    const after = await render('o-fixture-company');
    expect(visibleText()).toContain('Open Jobs at Fixture Company (0)');
    expect(before.equals(after)).toBe(false);
    expect(
      requests.filter((url) => url.pathname === '/jobs/feed'),
    ).toHaveLength(2);
  });

  it('renders the shared Twitter image with the same uncached count contract', async () => {
    await render('t-react', TwitterImage);
    expect(visibleText()).toContain('Open React Jobs (137)');
    expect(twitterDynamic).toBe('force-dynamic');
  });

  it.each([
    'upstream-private-sentinel',
    JSON.stringify({ totalJobs: 'upstream-private-sentinel' }),
  ])('does not expose upstream payloads in count errors', async (body) => {
    feedBody = body;
    const error = await fetchPillarJobCount('o-fixture-company').catch(
      (cause: unknown) => cause,
    );
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toMatch(/^Pillar job count payload/);
    expect((error as Error).message).not.toContain('upstream-private-sentinel');
    expect((error as Error).cause).toBeUndefined();
  });

  it.each([
    {},
    { totalJobs: -1 },
    { totalJobs: 1.5 },
    { totalJobs: '2' },
    { totalJobs: null },
  ])(
    'does not publish a fabricated zero for an invalid count: %j',
    async (payload) => {
      countOverride = payload;
      await expect(
        OpengraphImage({
          params: Promise.resolve({ slug: 'o-fixture-company' }),
        }),
      ).rejects.toThrow();
    },
  );

  it('propagates an upstream count failure rather than drawing zero', async () => {
    feedStatus = 503;
    await expect(fetchPillarJobCount('o-fixture-company')).rejects.toThrow(
      '503',
    );
  });

  it('does not fetch counts for an invalid pillar', async () => {
    await render('not-a-pillar');
    expect(visibleText()).toContain('Page Not Found');
    expect(requests).toHaveLength(0);
  });
});
