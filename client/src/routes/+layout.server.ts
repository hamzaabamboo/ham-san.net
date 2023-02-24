import { LANGUAGES } from '@utils/localization';
import type { LayoutServerLoadEvent } from './$types';

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ request, cookies }: LayoutServerLoadEvent) => {
	const preferredLanguages =
		(request.headers.get('content-language') && [request.headers.get('content-language')]) ||
		request.headers
			.get('accept-language')
			?.split(',')
			.map((l) => l.split(';')[0]);
	const defaultLanguage =
		preferredLanguages?.find((lang) => !!lang && LANGUAGES.includes(lang)) || 'en';
	if (!cookies.get('language')) {
		console.log('Set!!!!!!');
		cookies.set('language', defaultLanguage);
	}
	return {
		preferredLanguages,
		currentLanguage: cookies.get('language')
	};
};
