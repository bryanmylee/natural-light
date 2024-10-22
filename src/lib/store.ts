import {
	spring,
	type SpringOpts,
	type Updater as MotionUpdater,
	type SpringUpdateOpts
} from 'svelte/motion';
import { derived, type Readable, type Updater, type Writable } from 'svelte/store';

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

export type SnappedSpringUpdateOpts = SpringUpdateOpts & {
	snap?: boolean;
};

export type SnappedSpring<T> = Readable<T> & {
	set: (new_value: T, opts?: SnappedSpringUpdateOpts) => Promise<void>;
	update: (fn: MotionUpdater<T>, opts?: SnappedSpringUpdateOpts) => Promise<void>;
	precision: number;
	damping: number;
	stiffness: number;
};

export const snappedSpring = <T>(
	value: T,
	{ snapPoints = [], ...opts }: SnappedSpringOpts<T> = {}
): SnappedSpring<T> => {
	const snapped = (value: T): T => {
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
			if (opts?.snap === false) {
				return store.set(newValue, opts);
			} else {
				return store.set(snapped(newValue), opts);
			}
		},
		update(updater, opts) {
			return store.update((targetValue, currentValue) => {
				if (opts?.snap === false) {
					return updater(targetValue, currentValue);
				} else {
					return snapped(updater(targetValue, currentValue));
				}
			}, opts);
		}
	} satisfies SnappedSpring<T>;
};
