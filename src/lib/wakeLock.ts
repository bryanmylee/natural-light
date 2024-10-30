import { onMount } from 'svelte';

export const useWakeLock = () => {
	onMount(() => {
		let sentinel: WakeLockSentinel | null = null;

		// Initial wake-lock request.
		navigator.wakeLock.request('screen').then((sen) => (sentinel = sen));

		const handleInteraction = () => {
			// Re-request the wake-lock on user interaction if it's been released
			// by an external mechanism.
			if (sentinel == null || sentinel.released) {
				navigator.wakeLock.request('screen').then((sen) => (sentinel = sen));
			}
		};

		document.addEventListener('pointerdown', handleInteraction);

		return () => {
			sentinel?.release();
			document.removeEventListener('pointerdown', handleInteraction);
		};
	});
};
