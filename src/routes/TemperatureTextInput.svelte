<script lang="ts">
	import * as temperature from '$lib/color/temperature';
	import type { SnappedSpring } from '$lib/store';

	export let valueStore: SnappedSpring<temperature.Kelvin>;

	let valueString = Math.round($valueStore).toString();
	let focused = false;
	$: if (!focused) {
		valueString = Math.round($valueStore).toString();
	}

	const updateValue = () => {
		const valueFloat = temperature.kelvin(Math.round(parseFloat(valueString)));
		if (!isNaN(valueFloat)) {
			valueString = Math.round(valueFloat).toString();
			valueStore.set(valueFloat, { snap: false });
		}
	};
</script>

<form
	class="font-extrabold trim-inter text-unit-12 text-[--temp-ink-black] relative"
	on:submit={(ev) => {
		ev.preventDefault();
		updateValue();
	}}
>
	<input
		type="tel"
		bind:value={valueString}
		class="peer absolute bg-transparent px-1 -mx-1 focus-visible:outline-none caret-[--temp-ink] selection:bg-[--temp-highlight] selection:text-[--temp-ink-dark]"
		on:focus={() => (focused = true)}
		on:blur={() => {
			focused = false;
			updateValue();
		}}
	/>
	<span
		class="px-1 -mx-1 peer-focus-visible:ring-[length:--unit-size] ring-[--temp-ink] text-transparent rounded-lg"
	>
		{valueString}
	</span>
	<span class="text-[--temp-ink-dark]">K</span>
</form>
