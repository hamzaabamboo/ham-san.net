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
  output: 'static',
  adapter: netlify({
    imageCDN: false
    // cacheOnDemandPages: true
  }),
  prefetch: true,
  trailingSlash: 'ignore'
});
