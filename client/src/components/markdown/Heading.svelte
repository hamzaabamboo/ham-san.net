<script lang="ts">
	import Typography from '@components/core/Typography.svelte';

	// import { getContext } from 'svelte'
	// import { key } from '../context'
	export let depth: number;
	export let raw: string;
	export let text: string;
	// const { slug, getOptions } = getContext(key)
	// const options = getOptions()
	// $: id = options.headerIds
	//   ? options.headerPrefix + slug(text)
	//   : undefined
</script>

{#if depth === 1}
	<Typography variant="h1" class="mb-2"><slot /></Typography>
{:else if depth === 2}
	<Typography variant="h2" class="mb-2"><slot /></Typography>
{:else if depth === 3}
	<Typography class="mb-2"><slot /></Typography>
{:else if depth === 4}
	<Typography variant="h4"><slot /></Typography>
{:else if depth === 5}
	<h5><slot /></h5>
{:else if depth === 6}
	<h6><slot /></h6>
{:else}
	{raw}
{/if}
