import pandacss from '@pandacss/astro';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true
    }
  },
  integrations: [pandacss(), react()],
  output: 'hybrid',
  adapter: netlify()
});