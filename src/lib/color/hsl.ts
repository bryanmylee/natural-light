import { clampUnit, isInRange, isUnit } from '$lib/math';
import type { Branded } from '../brand';

export type Hue = Branded<'HslHue', number>;
export type Saturation = Branded<'HslSaturation', number>;
export type Lightness = Branded<'HslLightness', number>;

export const isHueValid = isInRange(0, 360) as (value: number) => value is Hue;
export const clampHue = (value: number): Hue => {
	if (isNaN(value)) return 0 as Hue;
	while (value < 0) {
		value += 360;
	}
	return (value % 360) as Hue;
};
export const assertHueValid = (value: number): asserts value is Hue => {
	if (!isHueValid(value)) throw new Error(`Invalid hue ${value}`);
};

export const isSaturationValid = isUnit as (value: number) => value is Saturation;
export const clampSaturation = clampUnit as (value: number) => Saturation;
export const assertSaturationValid = (value: number): asserts value is Saturation => {
	if (!isHueValid(value)) throw new Error(`Invalid saturation ${value}`);
};

export const isLightnessValid = isUnit as (value: number) => value is Lightness;
export const clampLightness = clampUnit as (value: number) => Lightness;
export const assertLightnessValid = (value: number): asserts value is Lightness => {
	if (!isLightnessValid(value)) throw new Error(`Invalid lightness ${value}`);
};

export type Hsl = Branded<'Hsl', readonly [Hue, Saturation, Lightness]>;

export const create = (h: number, s: number, l: number): Hsl => {
	return [clampHue(h), clampSaturation(s), clampLightness(l)] as const as Hsl;
};
export const createUnsafe = (h: number, s: number, l: number): Hsl => {
	return [h, s, l] as const as Hsl;
};

export const toCssProperty = ([h, s, l]: Hsl): string => {
	return `hsl(${h} ${s * 100}% ${l * 100}%)`;
};

/**
 * Darken using lightness by subtracting lightness.
 *
 * @param amount The amount to darken, given as a decimal between 0 and 1
 */
export const darken =
	(amount: number) =>
	([h, s, l]: Hsl): Hsl => {
		return create(h, s, l - amount);
	};

/**
 * Desaturate by subtracting saturation.
 *
 * @param amount The amount to desaturate, given as a decimal between 0 and 1
 */
export const desaturate =
	(amount: number) =>
	([h, s, l]: Hsl): Hsl => {
		return create(h, s - amount, l);
	};
