import type { Branded } from '$lib/brand';
import * as rgb from './rgb';

export type Kelvin = Branded<'Kelvin', number>;

export function kelvin(value: number): Kelvin {
	return value as Kelvin;
}

export const white = kelvin(6595);

/**
 * https://github.com/neilbartlett/color-temperature
 */
export function toRgb(kelvin: Kelvin): rgb.Rgb {
	const temperature = kelvin / 100;
	let red: number, green: number, blue: number;

	if (temperature < 66.0) {
		red = 255;
	} else {
		red = temperature - 55.0;
		red = 351.97690566805693 + 0.114206453784165 * red - 40.25366309332127 * Math.log(red);
	}

	if (temperature < 66.0) {
		// max = 250.7737809326484;
		const offset = 4.22621907;
		green = temperature - 2;
		green =
			offset +
			-155.25485562709179 -
			0.44596950469579133 * green +
			104.49216199393888 * Math.log(green);
	} else {
		// max = 248.85138969408513;
		const offset = 6.14861031;
		green = temperature - 50.0;
		green =
			offset + 325.4494125711974 + 0.07943456536662342 * green - 28.0852963507957 * Math.log(green);
	}

	if (temperature >= 66.0) {
		blue = 255;
	} else {
		if (temperature <= 20.0) {
			blue = 0;
		} else {
			blue = temperature - 10;
			blue = -254.76935184120902 + 0.8274096064007395 * blue + 115.67994401066147 * Math.log(blue);
		}
	}

	return rgb.create(red, green, blue);
}
