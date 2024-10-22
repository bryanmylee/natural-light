import * as hsl from '$lib/color/hsl';
import * as rgb from '$lib/color/rgb';
import * as temperature from '$lib/color/temperature';
import { lerp } from '$lib/math';
import { pipe } from '$lib/pipe';
import * as v from 'valibot';

export const TemperatureThemeSchema = v.object({
	paper: v.string(),
	ink: v.string(),
	inkBlack: v.string(),
	inkDark: v.string(),
	highlight: v.string()
});

export type TemperatureThemeSchema = v.InferOutput<typeof TemperatureThemeSchema>;

export const getTemperatureTheme = (tempKelvin: temperature.Kelvin): TemperatureThemeSchema => {
	const tempHsl = pipe(tempKelvin, temperature.toRgb, rgb.toHsl);
	const whiteFactor = temperature.whiteFactor(tempKelvin);
	return {
		paper: pipe(tempHsl, hsl.toCssProperty),
		ink: pipe(
			tempHsl,
			hsl.darken(0.3),
			hsl.desaturate(lerp(0.5, 1)(whiteFactor)),
			hsl.toCssProperty
		),
		inkBlack: pipe(
			tempHsl,
			hsl.darken(0.8),
			hsl.desaturate(lerp(0.2, 1)(whiteFactor)),
			hsl.toCssProperty
		),
		inkDark: pipe(
			tempHsl,
			hsl.darken(0.6),
			hsl.desaturate(lerp(0.6, 1)(whiteFactor)),
			hsl.toCssProperty
		),
		highlight: pipe(
			tempHsl,
			hsl.darken(-0.05),
			hsl.desaturate(lerp(0.2, 1)(whiteFactor)),
			hsl.toCssProperty
		)
	};
};

export const setDocumentTheme = (theme: TemperatureThemeSchema) => {
	if (typeof document === 'undefined') return;
	document.documentElement.style.backgroundColor = theme.paper;
	document.documentElement.style.setProperty('--temp-paper', theme.paper);
	document.documentElement.style.setProperty('--temp-ink', theme.ink);
	document.documentElement.style.setProperty('--temp-ink-black', theme.inkBlack);
	document.documentElement.style.setProperty('--temp-ink-dark', theme.inkDark);
	document.documentElement.style.setProperty('--temp-highlight', theme.highlight);
};
