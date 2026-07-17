import { defineMiddleware } from 'astro:middleware';
import { languages } from '~/i18n/ui';
import { validateLocale } from '~/i18n/utils';

const ROOT_SCOPED_PATHS = ['/robots.txt', '/favicon.svg', '/manifest.webmanifest'];

export const onRequest = defineMiddleware(({ url, preferredLocale, redirect }, next) => {
  const paths = url.pathname;
  const locale = validateLocale(preferredLocale) ? preferredLocale : 'en';

  if (ROOT_SCOPED_PATHS.includes(paths)) {
    return next();
  }

  if (!Object.keys(languages).includes(paths.split('/')[1])) {
    return redirect(`/${locale}${paths}${url.search}`);
  }

  // return a Response or the result of calling `next()`
  return next();
});
