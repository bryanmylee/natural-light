import { clamp, isInRange } from '$lib/math';
import type { Branded } from '../brand';
import * as hsl from './hsl';

export type RgbComponent = Branded<'RgbComponent', number>;

export const isRgbComponentValid = isInRange(0, 255) as (value: number) => value is RgbComponent;
export const clampRgbComponent = clamp(0, 255) as (value: number) => RgbComponent;
export const assertRgbComponentValid = (value: number): asserts value is RgbComponent => {
	if (!isRgbComponentValid(value)) throw new Error(`Invalid RGB component ${value}`);
};

export type Rgb = Branded<'Rgb', readonly [RgbComponent, RgbComponent, RgbComponent]>;

export const create = (r: number, g: number, b: number): Rgb => {
	return [clampRgbComponent(r), clampRgbComponent(g), clampRgbComponent(b)] as const as Rgb;
};
export const createUnsafe = (r: number, g: number, b: number): Rgb => {
	return [r, g, b] as const as Rgb;
};

export const toCssProperty = ([r, g, b]: Rgb): string => {
	return `rgb(${r} ${g} ${b})`;
};

export const toHsl = (rgb: Rgb): hsl.Hsl => {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;
	const lightness = (max + min) / 2;
	const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
	const hue =
		max === r
			? 60 * (((g - b) / delta) % 6)
			: max === g
				? 60 * ((b - r) / delta + 2)
				: max === b
					? 60 * ((r - g) / delta + 4)
					: 0;
	return hsl.create(hue, saturation, lightness);
};
