import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { join } from 'node:path';
// import { visualizer } from 'rollup-plugin-visualizer';
import type { UserConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

// const supportedExtensions = ['png', 'jpg', 'jpeg'];

const config: UserConfig = {
  plugins: [
    sveltekit(),
    imagetools({
      removeMetadata: true
    }),
    SvelteKitPWA({})
    // visualizer({
    // 	emitFile: true,
    // 	filename: 'stats.html'
    // })
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  },
  resolve: {
    alias: {
      i18n: join(__dirname, '../../libs/i18n/')
      // 'three/addons': join(__dirname, '../../node_modules/three/examples/jsm/')
    }
  }
};

export default config;
