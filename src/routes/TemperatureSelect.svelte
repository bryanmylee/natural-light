<script lang="ts">
	import { createSelect, melt } from '@melt-ui/svelte';
	import * as temperature from '$lib/color/temperature';
	import { derived, type Writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	export let valueStore: Writable<temperature.TemperatureSample>;
	export let options: temperature.TemperatureSample[];

	const {
		elements: { trigger, menu, option },
		states: { open, selectedLabel }
	} = createSelect<temperature.TemperatureSample>({
		selected: {
			...derived(valueStore, ($value) => ({
				value: $value,
				label: $value.name
			})),
			set(newValue) {
				valueStore.set(newValue.value);
			},
			update(updater) {
				valueStore.update((prev) => updater({ value: prev, label: prev.name }).value);
			}
		},
		forceVisible: true,
		positioning: {
			placement: 'top-start',
			fitViewport: true,
			gutter: 16
		}
	});
</script>

<div>
	<button
		use:melt={$trigger}
		class="font-semibold trim-inter hover:opacity-50 transition-opacity text-left focus-visible:outline-none focus-visible:underline"
		aria-label="Temperature"
	>
		{$selectedLabel}
	</button>
	{#if $open}
		<ul
			use:melt={$menu}
			transition:fade={{ duration: 200 }}
			class="z-10 overflow-hidden p-1 rounded-xl bg-[--temp-ink-black] ring-4 ring-[--temp-paper]"
		>
			{#each options as sampleOption}
				<li
					use:melt={$option({ value: sampleOption, label: sampleOption.name })}
					class="font-medium trim-inter p-3 rounded-lg text-[--temp-highlight] data-[selected]:bg-[--temp-ink] data-[highlighted]:bg-[--temp-ink] data-[highlighted]:underline cursor-pointer"
				>
					{sampleOption.name}
				</li>
			{/each}
		</ul>
	{/if}
</div>
