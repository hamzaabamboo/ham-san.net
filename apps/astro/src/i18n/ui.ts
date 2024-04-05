import ui from 'i18n/index';

export const languages = {
  en: 'English',
  ja: '日本語'
};

export type Languages = keyof typeof languages;

export const defaultLang = 'en';

export const routes = {
  en: {
    services: 'leistungen'
  },
  ja: {
    services: 'prestations-de-service'
  }
};

export { ui };
