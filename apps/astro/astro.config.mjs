import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';
import node from '@astrojs/node';

const adapter =
  process.env.ASTRO_ADAPTER === 'node'
    ? node({ mode: 'standalone' })
    : netlify({
        imageCDN: false
      });

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja', 'th'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false
    }
  },
  integrations: [react()],
  output: 'server',
  adapter,
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
