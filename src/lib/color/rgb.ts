import { clamp, isInRange } from '$lib/math';
import type { Branded } from '../brand';
import type { Kelvin } from './temperature';

export type RgbComponent = Branded<'RgbComponent', number>;

export const isRgbComponentValid = isInRange(0, 255) as (value: number) => value is RgbComponent;
export const clampRgbComponent = clamp(0, 255) as (value: number) => RgbComponent;
export function assertRgbComponentValid(value: number): asserts value is RgbComponent {
	if (!isRgbComponentValid(value)) throw new Error(`Invalid RGB component ${value}`);
}

export type Rgb = Branded<'Rgb', readonly [RgbComponent, RgbComponent, RgbComponent]>;

export function create(r: number, g: number, b: number): Rgb {
	return [clampRgbComponent(r), clampRgbComponent(g), clampRgbComponent(b)] as const as Rgb;
}
export function createUnsafe(r: number, g: number, b: number): Rgb {
	return [r, g, b] as const as Rgb;
}

/**
 * https://github.com/neilbartlett/color-temperature
 */
export function fromTemperature(kelvin: Kelvin): Rgb {
	const temperature = kelvin / 100;
	let red: number, green: number, blue: number;

	if (temperature < 66.0) {
		red = 255;
	} else {
		red = temperature - 55.0;
		red = 351.97690566805693 + 0.114206453784165 * red - 40.25366309332127 * Math.log(red);
		if (red < 0) red = 0;
		if (red > 255) red = 255;
	}

	if (temperature < 66.0) {
		green = temperature - 2;
		green =
			-155.25485562709179 - 0.44596950469579133 * green + 104.49216199393888 * Math.log(green);
		if (green < 0) green = 0;
		if (green > 255) green = 255;
	} else {
		green = temperature - 50.0;
		green = 325.4494125711974 + 0.07943456536662342 * green - 28.0852963507957 * Math.log(green);
		if (green < 0) green = 0;
		if (green > 255) green = 255;
	}

	if (temperature >= 66.0) {
		blue = 255;
	} else {
		if (temperature <= 20.0) {
			blue = 0;
		} else {
			blue = temperature - 10;
			blue = -254.76935184120902 + 0.8274096064007395 * blue + 115.67994401066147 * Math.log(blue);
			if (blue < 0) blue = 0;
			if (blue > 255) blue = 255;
		}
	}

	return create(red, green, blue);
}

export function toCssProperty([r, g, b]: Rgb): string {
	return `rgb(${r} ${g} ${b})`;
}
