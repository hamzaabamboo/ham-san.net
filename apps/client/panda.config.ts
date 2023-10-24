import { defineConfig } from '@pandacss/dev';
import { createPreset } from '@park-ui/panda-preset';

export default defineConfig({
	// Whether to use css reset
	preflight: true,

	// Where to look for your css declarations
	presets: [
		'@pandacss/preset-base',
		createPreset({
			accentColor: 'orange',
			grayColor: 'neutral',
			borderRadius: 'sm'
		})
	],

	include: ['./src/**/*.{js,jsx,ts,svelte}'],

	staticCss: {
		recipes: {
			avatar: [{ size: ['*'] }],
			badge: [{ variant: ['*'], size: ['*'] }],
			button: [{ variant: ['*'], size: ['*'] }],
			checkbox: [{ size: ['*'] }],
			code: [{ variant: ['*'], size: ['*'] }],
			drawer: [{ placement: ['*'] }],
			icon: [{ size: ['*'] }],
			input: [{ size: ['*'] }],
			menu: [{ size: ['*'] }],
			numberInput: [{ size: ['*'] }],
			radioGroup: [{ size: ['*'] }],
			radioButtonGroup: [{ size: ['*'], variant: ['*'] }],
			ratingGroup: [{ size: ['*'] }],
			segmentGroup: [{ size: ['*'] }],
			select: [{ size: ['*'], variant: ['*'] }],
			switchRecipe: [{ size: ['*'] }],
			table: [{ size: ['*'], variant: ['*'] }],
			tabs: [{ size: ['*'], variant: ['*'] }],
			toggleGroup: [{ size: ['*'], variant: ['*'] }]
		},
		css: [
			{
				properties: {
					fontWeight: ['*'],
					textStyle: ['*'],
					hideFrom: ['*'],
					hideBelow: ['*']
				}
			}
		]
	},

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: {
		extend: {}
	},

	// The output directory for your css system
	outdir: 'styled-system'
});
