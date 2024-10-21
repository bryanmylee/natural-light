<script lang="ts">
	import { transformed } from '$lib/store';
	import { useLocalStorage } from '$lib/storage';
	import * as temperature from '$lib/color/temperature';
	import * as rgb from '$lib/color/rgb';
	import * as hsl from '$lib/color/hsl';
	import { pipe } from '$lib/pipe';
	import TemperatureSlider from './TemperatureSlider.svelte';

	const temperatureKelvin = transformed(
		useLocalStorage('temperature_in_kelvin', '6600'),
		(input) => {
			const floatValue = parseFloat(input);
			return isNaN(floatValue) ? temperature.white : temperature.kelvin(floatValue);
		},
		(output) => String(output)
	);
	$: temperatureHsl = pipe($temperatureKelvin, temperature.toRgb, rgb.toHsl);
</script>

<div
	class="fixed inset-0 flex flex-col items-center bg-[--temp-paper]"
	style:--temp-paper={pipe(temperatureHsl, hsl.toCssProperty)}
	style:--temp-ink={pipe(temperatureHsl, hsl.darken(0.9), hsl.desaturate(0.1), hsl.toCssProperty)}
	style:--temp-track-empty={pipe(
		temperatureHsl,
		hsl.darken(0.6),
		hsl.desaturate(0.6),
		hsl.toCssProperty
	)}
	style:--temp-track-filled={pipe(
		temperatureHsl,
		hsl.darken(0.3),
		hsl.desaturate(0.5),
		hsl.toCssProperty
	)}
	style:--temp-highlight={pipe(
		temperatureHsl,
		hsl.darken(-0.05),
		hsl.desaturate(0.2),
		hsl.toCssProperty
	)}
>
	<div class="flex-1 container mx-auto flex flex-col">
		<div class="flex-1" />
		<div class="p-8 flex flex-col gap-4">
			<TemperatureSlider bind:value={$temperatureKelvin} />
			<p class="font-bold text-[clamp(0.9rem,1rem+4vw,10rem)] text-[--temp-ink]">
				<span>{Math.floor($temperatureKelvin)}</span> K
			</p>
		</div>
	</div>
</div>
