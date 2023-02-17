import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import preprocess from 'svelte-preprocess';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		preprocess()
	],
	kit: {
		adapter: adapter(),
		alias: {
			'@components': 'src/components',
			'@i18n': 'src/i18n',
			'@graphql': 'src/graphql',
			'@utils': 'src/utils'
		}
	}
};

export default config;
