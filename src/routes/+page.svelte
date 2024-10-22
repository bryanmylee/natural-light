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

<div class="fixed inset-0 flex flex-col items-center">
	<div class="flex-1 container mx-auto flex flex-col text-[--temp-ink-black]">
		<div class="flex-1" />
		<div class="p-unit-8 flex flex-col">
			<TemperatureSlider
				valueStore={smoothTempKelvin}
				min={temperature.min}
				max={temperature.max}
				ticks={temperature.samples}
			/>
			<div class="h-unit-4" />
			<TemperatureTextInput bind:value={$smoothTempKelvin} />
			<div class="h-unit-4" />
			<div class="text-unit-5">
				<p class="measure-height font-semibold trim-inter">
					{temperature.getSample($smoothTempKelvin).name}
				</p>
				<div class="h-unit-4" />
				<p class="measure-height trim-inter text-[0.7em]">
					<a
						href="https://bryanmylee.com"
						class="w-fit uppercase font-semibold hover:opacity-75 focus-visible:outline-none focus-visible:underline text-[--temp-ink]"
					>
						Bryan Lee
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
