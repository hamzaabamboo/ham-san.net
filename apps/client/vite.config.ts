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
	},
	server: {
		fs: {
			allow: ['styled-system']
		}
	},
	resolve: {
		alias: {
			// 'three/addons': join(__dirname, '../../node_modules/three/examples/jsm/')
		}
	}
};

export default config;
