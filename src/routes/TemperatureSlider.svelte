<script lang="ts">
	import type { Kelvin } from '$lib/color/temperature';
	import { createSlider, melt } from '@melt-ui/svelte';
	import { spring } from 'svelte/motion';

	export let value: Kelvin;

	const smoothValue = spring([value]);
	$: value = $smoothValue[0];

	const {
		elements: { root, range, thumbs }
	} = createSlider({
		value: smoothValue,
		min: 2600,
		max: 10600,
		step: 1
	});
</script>

<span use:melt={$root} class="relative flex h-[20px] items-center">
	<span class="h-1 w-full bg-[--temp-track-empty]">
		<span {...$range} use:range class="h-1 bg-[--temp-track-filled]" />
	</span>

	<span
		use:melt={$thumbs[0]}
		class="h-5 w-5 rounded-full bg-[--temp-track-filled] focus-visible:outline-none focus-visible:ring-4 ring-[--temp-paper]"
	/>
</span>
