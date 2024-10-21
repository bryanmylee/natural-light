import type { Branded } from '$lib/brand';
import { clamp } from '$lib/math';
import * as rgb from './rgb';

export type Kelvin = Branded<'Kelvin', number>;

export function kelvin(value: number): Kelvin {
	return clamp(min, max)(value) as Kelvin;
}
export function kelvinUnsafe(value: number): Kelvin {
	return value as Kelvin;
}

export const min = kelvinUnsafe(2600);
export const max = kelvinUnsafe(10600);
export const white = kelvinUnsafe(6600);
export const whiteLow = kelvinUnsafe(6400);
export const whiteHigh = kelvinUnsafe(6800);

/**
 * Return a smooth curve crossing (whiteLow, 0), (white, 1), (whiteHigh, 0).
 */
export function whiteFactor(temperature: Kelvin): number {
	if (temperature < whiteLow || temperature > whiteHigh) return 0;
	// map whiteLow..whiteHigh to 0..1
	const x = (temperature - whiteLow) / (whiteHigh - whiteLow);
	// map x to a U-shaped curve crossing (0, 1), (0.5, 0), (1, 1)
	const u = 0.5 * (1 - Math.sin(2 * Math.PI * (x - 0.25)));
	// the flatness at the base of the curve
	const f = 1.25;
	return 1 - Math.pow(u, f);
}

/**
 * https://github.com/neilbartlett/color-temperature
 */
export function toRgb(temperature: Kelvin): rgb.Rgb {
	const temp = temperature / 100;
	let red: number, green: number, blue: number;

	if (temp < 66.0) {
		red = 255;
	} else {
		red = temp - 55.0;
		red = 351.97690566805693 + 0.114206453784165 * red - 40.25366309332127 * Math.log(red);
	}

	if (temp < 66.0) {
		// max = 250.7737809326484;
		const offset = 4.22621907;
		green = temp - 2;
		green =
			offset +
			-155.25485562709179 -
			0.44596950469579133 * green +
			104.49216199393888 * Math.log(green);
	} else {
		// max = 248.85138969408513;
		const offset = 6.14861031;
		green = temp - 50.0;
		green =
			offset + 325.4494125711974 + 0.07943456536662342 * green - 28.0852963507957 * Math.log(green);
	}

	if (temp >= 66.0) {
		blue = 255;
	} else {
		if (temp <= 20.0) {
			blue = 0;
		} else {
			blue = temp - 10;
			blue = -254.76935184120902 + 0.8274096064007395 * blue + 115.67994401066147 * Math.log(blue);
		}
	}

	return rgb.create(red, green, blue);
}
