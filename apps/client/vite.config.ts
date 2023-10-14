import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
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
	}
};

export default config;
