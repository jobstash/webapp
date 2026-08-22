import { describe, expect, it } from 'vitest';

import {
  buildSitemapIndexXml,
  buildUrlsetResponse,
  buildUrlsetXml,
  escapeXml,
} from './build-sitemap-xml';

describe('escapeXml', () => {
  it('escapes all five xml special characters', () => {
    expect(escapeXml(`a&b<c>d"e'f`)).toBe('a&amp;b&lt;c&gt;d&quot;e&apos;f');
  });

  it('returns plain strings unchanged', () => {
    expect(escapeXml('https://example.com/t-react')).toBe(
      'https://example.com/t-react',
    );
  });
});

describe('buildUrlsetXml', () => {
  it('renders loc and lastmod entries', () => {
    const xml = buildUrlsetXml([
      {
        loc: 'https://example.com/a',
        lastModified: new Date('2026-01-02T03:04:05.000Z'),
      },
      { loc: 'https://example.com/b' },
    ]);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain(
      '<url><loc>https://example.com/a</loc><lastmod>2026-01-02T03:04:05.000Z</lastmod></url>',
    );
    expect(xml).toContain('<url><loc>https://example.com/b</loc></url>');
  });

  it('renders a valid empty urlset for no entries', () => {
    const xml = buildUrlsetXml([]);
    expect(xml).toContain('<urlset');
    expect(xml).toContain('</urlset>');
    expect(xml).not.toContain('<url>');
  });

  it('escapes special characters in locs', () => {
    const xml = buildUrlsetXml([{ loc: 'https://example.com/?a=1&b=2' }]);
    expect(xml).toContain('https://example.com/?a=1&amp;b=2');
  });
});

describe('buildSitemapIndexXml', () => {
  it('renders one sitemap element per loc', () => {
    const xml = buildSitemapIndexXml([
      'https://example.com/sitemap1.xml',
      'https://example.com/sitemap2.xml',
    ]);

    expect(xml).toContain('<sitemapindex');
    expect(xml).toContain(
      '<sitemap><loc>https://example.com/sitemap1.xml</loc></sitemap>',
    );
    expect(xml).toContain(
      '<sitemap><loc>https://example.com/sitemap2.xml</loc></sitemap>',
    );
  });
});

describe('buildUrlsetResponse', () => {
  it('responds with the xml content type', () => {
    const response = buildUrlsetResponse([]);
    expect(response.headers.get('Content-Type')).toBe(
      'application/xml; charset=utf-8',
    );
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });
});
