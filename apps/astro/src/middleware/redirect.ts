import { languages } from '../i18n/ui';

const rootScopedPaths = [
  '/robots.txt',
  '/favicon-64.png',
  '/apple-touch-icon.png',
  '/og-default.png'
];

const isPublicAsset = (pathname: string) =>
  rootScopedPaths.includes(pathname) || pathname.startsWith('/images/');

export const getLocaleRedirect = (pathname: string, search: string, locale: string) => {
  if (isPublicAsset(pathname)) return null;
  const first = pathname.split('/')[1];
  if (Object.keys(languages).includes(first)) return null;
  // A path whose first segment looks like a locale but is not one must 404 directly rather
  // than being prefixed: `/xx/nope` was redirecting to the nonsense `/en/xx/nope`.
  if (/^[a-z]{2}(-[a-z]{2})?$/i.test(first)) return null;
  return `/${locale}${pathname}${search}`;
};
