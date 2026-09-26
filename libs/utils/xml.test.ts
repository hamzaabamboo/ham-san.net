import { describe, expect, test } from 'bun:test';
import { escapeXml } from './xml';

describe('escapeXml', () => {
  test('escapes every character that can break a document', () => {
    expect(escapeXml('a & b')).toBe('a &amp; b');
    expect(escapeXml('<tag>')).toBe('&lt;tag&gt;');
    expect(escapeXml(`it's "quoted"`)).toBe('it&apos;s &quot;quoted&quot;');
  });

  test('a single unescaped ampersand is what takes a whole feed down', () => {
    // Not one broken entry — an XML document with a raw `&` fails to parse entirely, so
    // every crawler loses the whole sitemap or feed.
    const slug = 'tools-&-toys';
    expect(escapeXml(`https://ham-san.net/en/projects/${slug}`)).toBe(
      'https://ham-san.net/en/projects/tools-&amp;-toys'
    );
  });

  test('leaves ordinary text untouched', () => {
    expect(escapeXml('ham-san.net')).toBe('ham-san.net');
    expect(escapeXml('推し活記録')).toBe('推し活記録');
  });
});

const ENDPOINTS = [
  'apps/astro/src/pages/[locale]/sitemap.xml.ts',
  'apps/astro/src/pages/[locale]/rss.xml.ts'
];

// The whole tag BODY, not just an interpolation flush against the opening tag: a guard
// anchored to `<title>${` is defeated by `<title>Notes: ${title}</title>`, and one that
// checks only the first `${...}` never examines `${slug}` in
// `<loc>${SITE_URL}/${locale}/projects/${slug}</loc>`.
const TEXT_TAG = /<(loc|title|description|link|url)>([\s\S]*?)<\/\1>/g;
const INTERPOLATION = /\$\{([^}]+)\}/g;
const SAFE = /^(esc|escapeXml)\(|^SITE_URL$|^locale$/;

describe.each(ENDPOINTS)('%s', (path) => {
  test('every interpolation in a text position is escaped', async () => {
    // `expect(source).toContain('escapeXml')` is satisfied by the import line alone, so it
    // survives deleting every call site. Check the shape of each interpolation instead.
    const source = await Bun.file(path).text();
    const found = [...source.matchAll(TEXT_TAG)].flatMap(([, , body]) =>
      [...body.matchAll(INTERPOLATION)].map((m) => m[1].trim())
    );
    expect(found.length).toBeGreaterThan(0);
    expect(found.filter((expression) => !SAFE.test(expression))).toEqual([]);
  });

  test('a degraded response is not served as 200', async () => {
    // A crawler treats a 200 as the complete, authoritative set, so a CMS outage would drop
    // every project URL from the index rather than leaving the previous document in place.
    const source = await Bun.file(path).text();
    expect(source).toMatch(/status:\s*cmsUnavailable\s*\?\s*503/);
    expect(source).toMatch(/'no-store'/);
  });
});

describe('endpoint specifics', () => {
  test('the sitemap url-encodes the slug it puts in a path segment', async () => {
    const source = await Bun.file('apps/astro/src/pages/[locale]/sitemap.xml.ts').text();
    // Tied to the value that reaches the tag, so it cannot be satisfied by a dead `const`.
    expect(source).toMatch(/const href = `[^`]*\$\{encodeURIComponent\(slug\)\}[^`]*`/);
    expect(source).toContain('escapeXml(href)');
  });
});
