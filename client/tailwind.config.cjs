/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Noto Sans JP', 'Noto Sans TH', 'sans-serif']
		},
		extend: {
			colors: {
				primary: '#FABC2A',
				secondary: '#43AA8B'
			}
		}
	},
	plugins: []
};
