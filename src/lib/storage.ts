import { writable, type Updater, type Writable } from 'svelte/store';

export function useLocalStorage(key: string): Writable<string | null>;
export function useLocalStorage(key: string, defaultValue: string): Writable<string>;
export function useLocalStorage(key: string, defaultValue?: string): Writable<string | null> {
	const store = writable(defaultValue ?? null, (set) => {
		if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
		set(localStorage.getItem(key));
		const handler = (ev: StorageEvent) => {
			if (ev.key !== key) return;
			set(ev.newValue);
		};
		window.addEventListener('storage', handler);
		return () => window.removeEventListener('storage', handler);
	});

	const setLocalStorage = (value: string | null) => {
		if (typeof localStorage === 'undefined') return;
		if (value === null) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, value);
		}
	};

	/**
	 * Update the value of local storage.
	 *
	 * If set to `null`, removes the item from local storage.
	 */
	const set = (value: string | null) => {
		store.set(value ?? defaultValue ?? null);
		setLocalStorage(value);
	};

	/**
	 * Update the value of local storage.
	 *
	 * If set to `null`, removes the item from local storage.
	 */
	const update = (updater: Updater<string | null>) => {
		store.update((value) => {
			const newValue = updater(value);
			setLocalStorage(newValue);
			return newValue ?? defaultValue ?? null;
		});
	};

	return { subscribe: store.subscribe, set, update };
}
