<script lang="ts">
	import { transformed } from '$lib/store';
	import { useLocalStorage } from '$lib/storage';
	import * as temperature from '$lib/color/temperature';
	import * as rgb from '$lib/color/rgb';
	import * as hsl from '$lib/color/hsl';
	import { pipe } from '$lib/pipe';
	import TemperatureSlider from './TemperatureSlider.svelte';
	import { lerp } from '$lib/math';
	import TemperatureTextInput from './TemperatureTextInput.svelte';
	import { spring } from 'svelte/motion';

	const tempKelvin = transformed(
		useLocalStorage('temperature_in_kelvin', '6600'),
		(input) => {
			const floatValue = parseFloat(input);
			return isNaN(floatValue) ? temperature.white : temperature.kelvin(floatValue);
		},
		(output) => String(output)
	);

	const smoothTempKelvin = spring($tempKelvin);
	$: tempKelvin.set($smoothTempKelvin);

	$: tempHsl = pipe($tempKelvin, temperature.toRgb, rgb.toHsl);
	$: whiteFactor = temperature.whiteFactor($tempKelvin);
</script>

<div
	class="fixed inset-0 flex flex-col items-center bg-[--temp-paper]"
	style:--temp-paper={pipe(tempHsl, hsl.toCssProperty)}
	style:--temp-ink-black={pipe(
		tempHsl,
		hsl.darken(0.8),
		hsl.desaturate(lerp(0.2, 1)(whiteFactor)),
		hsl.toCssProperty
	)}
	style:--temp-ink-dark={pipe(
		tempHsl,
		hsl.darken(0.6),
		hsl.desaturate(lerp(0.6, 1)(whiteFactor)),
		hsl.toCssProperty
	)}
	style:--temp-ink={pipe(
		tempHsl,
		hsl.darken(0.3),
		hsl.desaturate(lerp(0.5, 1)(whiteFactor)),
		hsl.toCssProperty
	)}
	style:--temp-highlight={pipe(
		tempHsl,
		hsl.darken(-0.05),
		hsl.desaturate(lerp(0.2, 1)(whiteFactor)),
		hsl.toCssProperty
	)}
>
	<div class="flex-1 container mx-auto flex flex-col">
		<div class="flex-1" />
		<div class="p-8 flex flex-col gap-4">
			<TemperatureSlider valueStore={smoothTempKelvin} />
			<TemperatureTextInput bind:value={$smoothTempKelvin} />
		</div>
	</div>
</div>
