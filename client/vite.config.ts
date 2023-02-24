import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';
import type { UserConfig } from 'vite';

const supportedExtensions = ['png', 'jpg', 'jpeg'];

const config: UserConfig = {
	plugins: [
		sveltekit(),
		imagetools({
			removeMetadata: true,
			defaultDirectives: (url) => {
				const extension = url.pathname.substring(url.pathname.lastIndexOf('.') + 1) as string;
				if (supportedExtensions.includes(extension)) {
					return new URLSearchParams({
						format: 'webp;' + extension,
						picture: 'true',
						width: '1980'
					});
				}
				return new URLSearchParams();
			}
		})
		// SvelteKitPWA()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
