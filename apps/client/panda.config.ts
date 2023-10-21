import { defineConfig } from '@pandacss/dev';
import { createPreset } from '@park-ui/panda-preset';

export default defineConfig({
	// Whether to use css reset
	preflight: true,

	// Where to look for your css declarations
	presets: [
		'@pandacss/preset-base',
		createPreset({
			accentColor: 'neutral',
			grayColor: 'neutral',
			borderRadius: 'sm'
		})
	],

	include: ['./src/**/*.{js,jsx,ts,svelte}'],

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: {
		extend: {}
	},

	// The output directory for your css system
	outdir: 'styled-system'
});
