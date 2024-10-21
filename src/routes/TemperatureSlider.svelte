<script lang="ts">
	import * as temperature from '$lib/color/temperature';
	import { createSlider, melt } from '@melt-ui/svelte';
	import { derived, type Updater, type Writable } from 'svelte/store';

	export let valueStore: Writable<temperature.Kelvin>;

	const value = {
		...derived(valueStore, ($valueStore) => [$valueStore]),
		set(newValue: temperature.Kelvin[]) {
			valueStore.set(newValue[0]);
		},
		update(updater: Updater<temperature.Kelvin[]>) {
			valueStore.update(($value) => updater([$value])[0]);
		}
	};

	const {
		elements: { root, range, thumbs }
	} = createSlider({
		value,
		min: temperature.min,
		max: temperature.max,
		step: 1
	});
</script>

<span use:melt={$root} class="relative flex h-[20px] items-center">
	<span class="h-1 w-full bg-[--temp-ink-dark]">
		<span {...$range} use:range class="h-1 bg-[--temp-ink]" />
	</span>

	<span
		use:melt={$thumbs[0]}
		class="h-5 w-5 rounded-full bg-[--temp-ink] focus-visible:outline-none focus-visible:ring-4 ring-[--temp-paper]"
	/>
</span>
