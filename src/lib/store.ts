import { spring, type Spring, type SpringOpts } from 'svelte/motion';
import { derived, type Updater, type Writable } from 'svelte/store';

export const transformed = <T, U>(
	source: Writable<T>,
	transform: (input: T) => U,
	untransform: (output: U) => T
): Writable<U> => {
	const { subscribe } = derived(source, transform);
	const set = (output: U) => {
		source.set(untransform(output));
	};
	const update = (updater: Updater<U>) => {
		source.update((prev) => untransform(updater(transform(prev))));
	};
	return { subscribe, set, update };
};

export type SnappedSpringOpts<T> = SpringOpts & {
	snapPoints?: SnapPoint<T>[];
};

export type SnapPoint<T> = {
	value: T;
	min: T;
	max: T;
};

export type SnappedValue<T> = {
	value: T;
	snapped: 0 | 1;
};

export type SnappedSpring<T> = Spring<T>;

export const snappedSpring = <T>(
	value: T,
	{ snapPoints = [], ...opts }: SnappedSpringOpts<T> = {}
): SnappedSpring<T> => {
	const getSnappedValue = (value: T): T => {
		for (const snapPoint of snapPoints) {
			if (snapPoint.min <= value && value <= snapPoint.max) {
				return snapPoint.value;
			}
		}
		return value;
	};

	const store = spring(value, opts);

	return {
		...store,
		set(newValue, opts) {
			return store.set(getSnappedValue(newValue), opts);
		},
		update(updater, opts) {
			return store.update((targetValue, currentValue) => {
				return getSnappedValue(updater(targetValue, currentValue));
			}, opts);
		}
	};
};
