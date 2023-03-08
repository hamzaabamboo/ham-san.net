import { locale, loadTranslations } from '@i18n';
import type { LayoutLoad } from './$types';
import { LANGUAGES } from '@utils/localization';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ url, data }) => {
	const { pathname } = url;
	const { preferredLanguages = [], currentLanguage } = data;
	const defaultLocale =
		preferredLanguages.find((lang) => !!lang && LANGUAGES.includes(lang)) || 'en'; // get from cookie, user session, ...
	const serverLanguage = currentLanguage || defaultLocale;
	locale.set(serverLanguage);
	const initLocale = browser ? locale.get() ?? serverLanguage : serverLanguage;
	await loadTranslations(initLocale, pathname); // keep this just before the `return`

	return {};
};
