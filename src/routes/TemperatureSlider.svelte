<script lang="ts">
	import * as temperature from '$lib/color/temperature';
	import type { SnappedSpring } from '$lib/store';
	import { createSlider, melt } from '@melt-ui/svelte';
	import { derived, type Updater } from 'svelte/store';

	export let valueStore: SnappedSpring<temperature.Kelvin>;
	export let min: temperature.Kelvin;
	export let max: temperature.Kelvin;
	export let ticks: temperature.TemperatureSample[];

	const {
		elements: { root, range, thumbs },
		states: { active }
	} = createSlider({
		value: {
			...derived(valueStore, ($value) => [$value]),
			set(newValue: temperature.Kelvin[]) {
				if (!$active) return;
				valueStore.set(newValue[0]);
			},
			update(updater: Updater<temperature.Kelvin[]>) {
				if (!$active) return;
				valueStore.update((prev) => updater([prev])[0]);
			}
		},
		min,
		max
	});
</script>

<span use:melt={$root} class="relative h-unit-7 flex items-center">
	<span class="h-unit w-full rounded-full bg-[--temp-ink-dark]">
		<span {...$range} use:range class="h-unit rounded-full bg-[--temp-ink]" />
	</span>

	{#each ticks as tick}
		<span
			data-value={tick.ideal}
			data-bounded={tick.ideal <= $valueStore || undefined}
			style:--value-offset="{((tick.ideal - min) / (max - min)) * 100}%"
			class="h-unit-3 w-unit rounded-full absolute left-[--value-offset] rtl:right-[--value-offset] rtl:left-auto -translate-x-1/2 rtl:translate-x-0 bg-[--temp-ink-dark] data-[bounded]:bg-[--temp-ink]"
		/>
	{/each}

	<span
		use:melt={$thumbs[0]}
		class="h-unit-4 w-unit-4 rounded-full bg-[--temp-ink] focus-visible:outline-none focus:ring-[length:--unit-size] ring-[--temp-ink] focus:bg-[--temp-paper]"
	/>
</span>
