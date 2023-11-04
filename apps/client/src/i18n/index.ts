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
      pathname: '/',
      loader: async () => (await import('./en/home.json')).default
    },
    {
      locale: 'ja',
      key: 'home',
      pathname: '/',
      loader: async () => (await import('./ja/home.json')).default
    },
    {
      locale: 'en',
      key: 'project',
      pathname: '/project',
      loader: async () => (await import('./en/project.json')).default
    },
    {
      locale: 'ja',
      key: 'project',
      pathname: '/project',
      loader: async () => (await import('./ja/project.json')).default
    },
    {
      locale: 'en',
      key: 'contact',
      pathname: '/contact',
      loader: async () => (await import('./en/contact.json')).default
    },
    {
      locale: 'ja',
      key: 'contact',
      pathname: '/contact',
      loader: async () => (await import('./ja/contact.json')).default
    },
    {
      locale: 'en',
      key: 'about-me',
      pathname: '/about',
      loader: async () => (await import('./en/about-me.json')).default
    },
    {
      locale: 'ja',
      key: 'about-me',
      pathname: '/about',
      loader: async () => (await import('./ja/about-me.json')).default
    },
    {
      locale: 'en',
      key: 'blog',
      pathname: '/blog',
      loader: async () => (await import('./en/blog.json')).default
    },
    {
      locale: 'ja',
      key: 'blog',
      pathname: '/blog',
      loader: async () => (await import('./ja/blog.json')).default
    },
    {
      locale: 'en',
      key: 'note',
      pathname: '/note',
      loader: async () => (await import('./en/note.json')).default
    },
    {
      locale: 'ja',
      key: 'note',
      pathname: '/note',
      loader: async () => (await import('./ja/note.json')).default
    }
  ]
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
