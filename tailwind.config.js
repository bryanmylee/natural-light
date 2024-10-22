import defaultTheme from 'tailwindcss/defaultTheme';
import unitSize from './tailwindcss/unitSize.cjs';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.svelte', './src/app.html'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['InterVariable', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: [unitSize]
};
