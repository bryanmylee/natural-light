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

	const temperatureKelvin = transformed(
		useLocalStorage('temperature_in_kelvin', '6600'),
		(input) => {
			const floatValue = parseFloat(input);
			return isNaN(floatValue) ? temperature.white : temperature.kelvin(floatValue);
		},
		(output) => String(output)
	);
	$: temperatureHsl = pipe($temperatureKelvin, temperature.toRgb, rgb.toHsl);
	$: whiteFactor = temperature.whiteFactor($temperatureKelvin);
</script>

<div
	class="fixed inset-0 flex flex-col items-center bg-[--temp-paper]"
	style:--temp-paper={pipe(temperatureHsl, hsl.toCssProperty)}
	style:--temp-ink-black={pipe(
		temperatureHsl,
		hsl.darken(0.8),
		hsl.desaturate(lerp(0.2, 1)(whiteFactor)),
		hsl.toCssProperty
	)}
	style:--temp-ink-dark={pipe(
		temperatureHsl,
		hsl.darken(0.6),
		hsl.desaturate(lerp(0.6, 1)(whiteFactor)),
		hsl.toCssProperty
	)}
	style:--temp-ink={pipe(
		temperatureHsl,
		hsl.darken(0.3),
		hsl.desaturate(lerp(0.5, 1)(whiteFactor)),
		hsl.toCssProperty
	)}
	style:--temp-highlight={pipe(
		temperatureHsl,
		hsl.darken(-0.05),
		hsl.desaturate(lerp(0.2, 1)(whiteFactor)),
		hsl.toCssProperty
	)}
>
	<div class="flex-1 container mx-auto flex flex-col">
		<div class="flex-1" />
		<div class="p-8 flex flex-col gap-4">
			<TemperatureSlider bind:value={$temperatureKelvin} />
			<TemperatureTextInput bind:value={$temperatureKelvin} />
		</div>
	</div>
</div>
