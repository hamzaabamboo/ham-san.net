import { defineMiddleware } from 'astro:middleware';
import { validateLocale } from '~/i18n/utils';
import { getLocaleRedirect } from './redirect';

export const onRequest = defineMiddleware(({ url, preferredLocale, redirect }, next) => {
  const locale = validateLocale(preferredLocale) ? preferredLocale : 'en';
  const target = getLocaleRedirect(url.pathname, url.search, locale);

  return target ? redirect(target) : next();
});
