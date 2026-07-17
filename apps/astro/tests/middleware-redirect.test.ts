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
  expect(getLocaleRedirect('/manifest.webmanifest', '', 'th')).toBeNull();
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
  const asset = await runMiddleware('/favicon.svg', undefined);
  expect(await localized.text()).toBe('next');
  expect(await asset.text()).toBe('next');
});
