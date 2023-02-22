import { locale, loadTranslations } from '@i18n';
import type { LayoutLoadEvent } from './$types';
import { LANGUAGES } from '@utils/localization';
import { browser } from '$app/environment';

/** @type {import('./$types').LayoutLoad} */
export const load = async ({ url, data }: LayoutLoadEvent) => {
	const { pathname } = url;
	const { preferredLanguages = [], currentLanguage } = data;
	const defaultLocale =
		preferredLanguages.find((lang) => !!lang && LANGUAGES.includes(lang)) || 'en'; // get from cookie, user session, ...
	const serverLanguage = currentLanguage || defaultLocale;
	const initLocale = browser ? locale.get() ?? serverLanguage : serverLanguage; // set default if no locale already set

	await loadTranslations(initLocale, pathname); // keep this just before the `return`

	return {};
};
