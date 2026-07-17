import { languages } from '../i18n/ui';

const rootScopedPaths = ['/robots.txt', '/favicon.svg', '/manifest.webmanifest'];

export const getLocaleRedirect = (pathname: string, search: string, locale: string) => {
  if (rootScopedPaths.includes(pathname)) return null;
  if (Object.keys(languages).includes(pathname.split('/')[1])) return null;
  return `/${locale}${pathname}${search}`;
};
