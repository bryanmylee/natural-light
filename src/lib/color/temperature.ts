import type { Branded } from '$lib/brand';

export type Kelvin = Branded<'Kelvin', number>;

export const plainWhite = 6595 as Kelvin;

export function kelvin(value: number): Kelvin {
	return value as Kelvin;
}
