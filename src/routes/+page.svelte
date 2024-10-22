<script lang="ts">
	import { snappedSpring, transformed } from '$lib/store';
	import { useLocalStorage } from '$lib/storage';
	import * as temperature from '$lib/color/temperature';
	import * as v from 'valibot';
	import TemperatureSlider from './TemperatureSlider.svelte';
	import TemperatureTextInput from './TemperatureTextInput.svelte';
	import {
		getTemperatureTheme,
		setDocumentTheme,
		TemperatureThemeSchema
	} from './temperatureTheme';

	const tempKelvin = transformed(
		useLocalStorage('temperature_in_kelvin', '6600'),
		(input) => {
			const floatValue = parseFloat(input);
			return isNaN(floatValue) ? temperature.white : temperature.kelvin(floatValue);
		},
		(output) => String(output)
	);

	const smoothTempKelvin = snappedSpring($tempKelvin, {
		snapPoints: temperature.samples.map((sample) => ({
			min: temperature.kelvin(sample.ideal - 250),
			value: sample.ideal,
			max: temperature.kelvin(sample.ideal + 250)
		}))
	});
	$: tempKelvin.set($smoothTempKelvin);

	const tempTheme = transformed(
		useLocalStorage('temperature_theme'),
		(input) => {
			const parseResult = v.safeParse(v.nullable(TemperatureThemeSchema), input);
			const defaultTheme = getTemperatureTheme($tempKelvin);
			return parseResult.success ? parseResult.output ?? defaultTheme : defaultTheme;
		},
		(output) => JSON.stringify(output)
	);
	$: $tempTheme = getTemperatureTheme($tempKelvin);
	$: setDocumentTheme($tempTheme);
</script>

<div class="fixed inset-0 flex flex-col items-center" style:--unit-size="max(0.25rem,0.5vw)">
	<div class="flex-1 container mx-auto flex flex-col text-[--temp-ink-black]">
		<div class="flex-1" />
		<div class="p-8 flex flex-col">
			<TemperatureSlider
				valueStore={smoothTempKelvin}
				min={temperature.min}
				max={temperature.max}
				ticks={temperature.samples}
			/>
			<div class="h-2" />
			<TemperatureTextInput bind:value={$smoothTempKelvin} />
			<div class="text-[clamp(0.9rem,1rem+1vw,5rem)]">
				<p class="font-semibold">{temperature.getSample($smoothTempKelvin).name}</p>
				<!-- <a
					href="https://bryanmylee.com"
					class="w-fit uppercase font-semibold text-[0.75em] focus-visible:outline-none focus-visible:underline text-[--temp-ink]"
					>Bryan Lee</a
				> -->
			</div>
		</div>
	</div>
</div>
