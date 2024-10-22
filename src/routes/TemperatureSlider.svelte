<script lang="ts">
	import * as temperature from '$lib/color/temperature';
	import { createSlider, melt } from '@melt-ui/svelte';
	import { derived, type Updater, type Writable } from 'svelte/store';

	export let valueStore: Writable<temperature.Kelvin>;
	export let min: temperature.Kelvin;
	export let max: temperature.Kelvin;
	export let ticks: temperature.TemperatureSample[];

	const value = {
		...derived(valueStore, ($valueStore) => [$valueStore]),
		set(newValue: temperature.Kelvin[]) {
			valueStore.set(newValue[0]);
		},
		update(updater: Updater<temperature.Kelvin[]>) {
			valueStore.update((prev) => updater([prev])[0]);
		}
	};

	const {
		elements: { root, range, thumbs }
	} = createSlider({
		value,
		min,
		max,
		step: 1
	});
</script>

<span use:melt={$root} class="relative flex h-[20px] items-center">
	<span class="h-[--unit-size] w-full rounded-full bg-[--temp-ink-dark]">
		<span {...$range} use:range class="h-[--unit-size] rounded-full bg-[--temp-ink]" />
	</span>

	{#each ticks as tick}
		<span
			data-value={tick.ideal}
			data-bounded={tick.ideal <= $valueStore || undefined}
			style:--value-offset="{((tick.ideal - min) / (max - min)) * 100}%"
			class="h-[calc(var(--unit-size)*3)] w-[--unit-size] rounded-full absolute left-[--value-offset] rtl:right-[--value-offset] rtl:left-auto -translate-x-1/2 rtl:translate-x-0 bg-[--temp-ink-dark] data-[bounded]:bg-[--temp-ink]"
		/>
	{/each}

	<span
		use:melt={$thumbs[0]}
		class="h-[calc(var(--unit-size)*4)] w-[calc(var(--unit-size)*4)] rounded-full bg-[--temp-ink] focus-visible:outline-none focus:ring-[length:--unit-size] ring-[--temp-ink] focus:bg-[--temp-paper]"
	/>
</span>
