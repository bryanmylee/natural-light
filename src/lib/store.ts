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
