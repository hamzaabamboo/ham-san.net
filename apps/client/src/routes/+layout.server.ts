import { LANGUAGES } from '@utils/localization';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, cookies }) => {
  const preferredLanguages =
    (request.headers.get('content-language') && [request.headers.get('content-language')]) ||
    request.headers
      .get('accept-language')
      ?.split(',')
      .map((l) => l.split(';')[0]);
  const defaultLanguage =
    preferredLanguages?.find((lang) => !!lang && LANGUAGES.includes(lang)) || 'en';
  if (!cookies.get('language')) {
    cookies.set('language', defaultLanguage);
  }
  return {
    preferredLanguages,
    currentLanguage: cookies.get('language')
  };
};
