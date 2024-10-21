export const clamp =
	(low: number, high: number) =>
	(value: number): number => {
		if (isNaN(value) || value < low) return low;
		if (value > high) return high;
		return value;
	};

export const clampUnit = clamp(0, 1);

export const isInRange =
	(low: number, high: number) =>
	(value: number): boolean => {
		return !isNaN(value) && low <= value && value <= high;
	};

export const isUnit = isInRange(0, 1);

export const lerp =
	(a: number, b: number) =>
	(weight: number): number => {
		return a + (b - a) * weight;
	};
