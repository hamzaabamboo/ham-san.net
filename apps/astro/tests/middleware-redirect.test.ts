import { expect, mock, test } from 'bun:test';
import { getLocaleRedirect } from '../src/middleware/redirect';

mock.module('astro:middleware', () => ({ defineMiddleware: (handler: unknown) => handler }));

const { onRequest } = await import('../src/middleware');

const runMiddleware = (path: string, preferredLocale: string | undefined) =>
  onRequest(
    {
      url: new URL(path, 'https://ham-san.net'),
      preferredLocale,
      redirect: (target: string) =>
        new Response(null, { status: 302, headers: { Location: target } })
    } as never,
    () => Promise.resolve(new Response('next'))
  );

test('root-scoped assets bypass locale redirects', () => {
  expect(getLocaleRedirect('/robots.txt', '', 'ja')).toBeNull();
});

test('bare routes receive a locale without losing query state', () => {
  expect(getLocaleRedirect('/events', '?year=2024', 'ja')).toBe('/ja/events?year=2024');
});

test('localized routes pass through without redirect loops', () => {
  expect(getLocaleRedirect('/th/events', '?year=2024', 'ja')).toBeNull();
});

test('middleware redirects with a valid preferred locale and query', async () => {
  const response = await runMiddleware('/events?year=2024', 'ja');
  expect(response.status).toBe(302);
  expect(response.headers.get('Location')).toBe('/ja/events?year=2024');
});

test('middleware falls back to English for invalid preferred locales', async () => {
  const response = await runMiddleware('/notes', 'de');
  expect(response.headers.get('Location')).toBe('/en/notes');
});

test('middleware calls next for localized routes and root assets', async () => {
  const localized = await runMiddleware('/th/events?year=2024', 'ja');
  const favicon = await runMiddleware('/favicon-64.png', undefined);
  const appleIcon = await runMiddleware('/apple-touch-icon.png', undefined);
  const ogImage = await runMiddleware('/og-default.png', undefined);
  const nestedAsset = await runMiddleware('/images/placeholder-project.jpg', undefined);
  expect(await localized.text()).toBe('next');
  expect(await favicon.text()).toBe('next');
  expect(await appleIcon.text()).toBe('next');
  expect(await ogImage.text()).toBe('next');
  expect(await nestedAsset.text()).toBe('next');
});

test('a locale-shaped segment that is not a locale is not prefixed', async () => {
  // `/xx/nope` was redirecting to `/en/xx/nope` — a nonsense URL the user and any crawler
  // sees before the 404. A two-letter first segment that is not a known locale must 404
  // where it stands.
  const { getLocaleRedirect } = await import('../src/middleware/redirect');
  expect(getLocaleRedirect('/xx/nope', '', 'en')).toBeNull();
  expect(getLocaleRedirect('/zz', '', 'en')).toBeNull();
  // ...while a real path still gets its locale prefix.
  expect(getLocaleRedirect('/nope', '', 'en')).toBe('/en/nope');
  expect(getLocaleRedirect('/projects', '', 'ja')).toBe('/ja/projects');
});
