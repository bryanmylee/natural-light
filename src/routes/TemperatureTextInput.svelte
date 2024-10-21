<script lang="ts">
	import * as temperature from '$lib/color/temperature';

	export let value: temperature.Kelvin;

	let valueString: string = value.toString();
	$: valueString = Math.round(value).toString();

	const updateValue = () => {
		const floatValue = parseFloat(valueString);
		value = isNaN(floatValue) ? value : temperature.kelvin(floatValue);
		valueString = Math.round(value).toString();
	};
</script>

<form
	class="font-bold text-[clamp(0.9rem,1rem+4vw,10rem)] text-[--temp-ink-black] relative"
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
	<span class="px-1 -mx-1 peer-focus-visible:ring-4 ring-[--temp-ink] text-transparent rounded-lg">
		{valueString}
	</span>
	<span class="text-[--temp-ink-dark]">K</span>
</form>
