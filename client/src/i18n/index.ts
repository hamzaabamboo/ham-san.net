import i18n from 'sveltekit-i18n';

const config = {
	loaders: [
		{
			locale: 'en',
			key: 'common',
			loader: async () => (await import('./en/common.json')).default
		},
		{
			locale: 'en',
			key: 'home',
			loader: async () => (await import('./en/home.json')).default
		},
		{
			locale: 'ja',
			key: 'common',
			loader: async () => (await import('./jp/common.json')).default
		},
		{
			locale: 'ja',
			key: 'home',
			loader: async () => (await import('./jp/home.json')).default
		}
	]
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
