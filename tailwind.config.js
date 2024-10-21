import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.svelte'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['InterVariable', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: []
};
