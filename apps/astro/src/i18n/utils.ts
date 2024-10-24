import { defaultLang, ui } from './ui';

export function validateLocale(locale?: string): locale is keyof typeof ui {
  return !!locale && locale in ui;
}

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations<Lang extends keyof typeof ui = typeof defaultLang>(lang: Lang) {
  return function t<
    Collection extends keyof (typeof ui)[Lang],
    Key extends keyof (typeof ui)[Lang][Collection]
  >(key: `${string & Collection}.${string & Key}`): (typeof ui)[Lang][Collection][Key] | Key {
    const [collection, translationKey] = key.split('.') as [Collection, Key];
    const res =
      ui[lang][collection]?.[translationKey] ??
      ui[defaultLang as Lang][collection]?.[translationKey] ??
      translationKey;
    return res;
  };
}
