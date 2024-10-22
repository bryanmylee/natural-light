<script lang="ts">
	import * as temperature from '$lib/color/temperature';
	import type { Writable } from 'svelte/store';

	export let valueStore: Writable<temperature.Kelvin>;

	$: valueString = Math.round($valueStore).toString();

	const updateValue = () => {
		const valueFloat = parseFloat(valueString);
		if (!isNaN(valueFloat)) {
			valueStore.set(temperature.kelvin(valueFloat));
		}
		valueString = Math.round($valueStore).toString();
	};
</script>

<form
	class="measure-height font-extrabold trim-inter text-unit-12 text-[--temp-ink-black] relative"
	on:submit={(ev) => {
		ev.preventDefault();
		updateValue();
	}}
>
	<input
		type="tel"
		bind:value={valueString}
		class="peer absolute bg-transparent px-1 -mx-1 focus-visible:outline-none caret-[--temp-ink] selection:bg-[--temp-highlight] selection:text-[--temp-ink-dark]"
		on:blur={updateValue}
	/>
	<span
		class="peer-focus-visible:ring-[length:--unit-size] ring-[--temp-ink] text-transparent rounded-lg"
	>
		{valueString}
	</span>
	<span class="text-[--temp-ink-dark]">K</span>
</form>
