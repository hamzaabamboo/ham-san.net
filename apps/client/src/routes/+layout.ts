import { browser } from '$app/environment';
import { loadTranslations, locale } from '@i18n';
import { LANGUAGES } from '@utils/localization';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url, data }) => {
  const { pathname } = url;
  const { preferredLanguages = [], currentLanguage } = data;
  const defaultLocale =
    preferredLanguages.find((lang) => !!lang && LANGUAGES.includes(lang)) || 'en'; // get from cookie, user session, ...
  const serverLanguage = currentLanguage || defaultLocale;
  locale.set(serverLanguage);
  const initLocale = browser ? (locale.get() ?? serverLanguage) : serverLanguage;
  await loadTranslations(initLocale, pathname); // keep this just before the `return`

  return {};
};
