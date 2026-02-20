import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false
    }
  },
  integrations: [react()],
  output: 'server',
  adapter: netlify({
    imageCDN: false
    // cacheOnDemandPages: true
  }),
  vite: {
    resolve: {
      dedupe: ['react', 'react-dom']
    },
    ssr: {
      noExternal: ['@ark-ui/react', /^@zag-js\//]
    }
  },
  prefetch: true,
  trailingSlash: 'ignore'
});
