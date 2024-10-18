<script lang="ts">
	import { transformed } from '$lib/store';
	import { useLocalStorage } from '$lib/storage';
	import * as temperature from '$lib/color/temperature';
	import * as rgb from '$lib/color/rgb';
	import * as hsl from '$lib/color/hsl';
	import { pipe } from '$lib/pipe';

	const temperatureKelvin = transformed(
		useLocalStorage('temperature_in_kelvin', '6595'),
		(input) => {
			const floatValue = parseFloat(input);
			return isNaN(floatValue) ? temperature.plainWhite : temperature.kelvin(floatValue);
		},
		(output) => String(output)
	);
	$: temperatureHsl = pipe($temperatureKelvin, rgb.fromTemperature, hsl.fromRgb);
	$: textHsl = pipe(temperatureHsl, hsl.darken(0.8), hsl.desaturate(0.5));
</script>

<div
	class="fixed inset-0 flex flex-col items-center"
	style="background-color: {hsl.toCssProperty(temperatureHsl)}"
>
	<div class="flex-1 container mx-auto flex flex-col">
		<div class="flex-1" />
		<div class="p-8 flex flex-col gap-4">
			<input
				type="range"
				name="temperature"
				bind:value={$temperatureKelvin}
				min={4000}
				max={9000}
			/>
			<p
				class="font-bold text-[clamp(0.9rem,1rem+4vw,10rem)]"
				style="color: {hsl.toCssProperty(textHsl)}"
			>
				<span>{$temperatureKelvin}</span> K
			</p>
		</div>
	</div>
</div>
