import { languages } from './ui';

export const localePaths = (Object.keys(languages) as (keyof typeof languages)[]).map((locale) => {
  return { params: { locale } };
});
