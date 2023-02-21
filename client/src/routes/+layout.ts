import { locale, loadTranslations } from '@i18n';
import type { LayoutLoadEvent } from './$types';
import { LANGUAGES } from '@utils/localization';

/** @type {import('./$types').LayoutLoad} */
export const load = async ({ url, data }: LayoutLoadEvent) => {
	const { pathname } = url;
	const { preferredLanguages = [], currentLanguage } = data;
	const defaultLocale =
		preferredLanguages.find((lang) => !!lang && LANGUAGES.includes(lang)) || 'en'; // get from cookie, user session, ...
	const initLocale = currentLanguage || locale.get() || defaultLocale; // set default if no locale already set

	await loadTranslations(initLocale, pathname); // keep this just before the `return`

	return {};
};
