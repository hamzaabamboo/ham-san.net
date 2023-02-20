import i18n from 'sveltekit-i18n';

const config = {
	fallbackLocale: 'en',
	loaders: [
		{
			locale: 'en',
			key: 'common',
			loader: async () => (await import('./en/common.json')).default
		},
		{
			locale: 'ja',
			key: 'common',
			loader: async () => (await import('./ja/common.json')).default
		},
		{
			locale: 'en',
			key: 'home',
			loader: async () => (await import('./en/home.json')).default
		},
		{
			locale: 'ja',
			key: 'home',
			loader: async () => (await import('./ja/home.json')).default
		},
		{
			locale: 'en',
			key: 'project',
			loader: async () => (await import('./en/project.json')).default
		},
		{
			locale: 'ja',
			key: 'project',
			loader: async () => (await import('./ja/project.json')).default
		},
		{
			locale: 'en',
			key: 'contact',
			loader: async () => (await import('./en/contact.json')).default
		},
		{
			locale: 'ja',
			key: 'contact',
			loader: async () => (await import('./ja/contact.json')).default
		}
	]
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
