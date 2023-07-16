<script lang="ts">
	import Container from "@components/core/Container.svelte";
	import MetaTags from "@components/core/MetaTags.svelte";
	import Typography from "@components/core/Typography.svelte";
	import { t } from "@i18n";
	import type { PageData } from "./$types";

    export let data: PageData

    // $: console.log(data);
</script>

<MetaTags title="{$t('note.notes')} | {$t('common.name')}" path="notes" />

<Container class="pt-8">
	<Typography variant="h1" class="mb-2">{$t('note.notes')}</Typography>
	{#each data.data as item}
		<Typography>
			{#if item.url}
				<a target="_blank" rel="noreferrer" class="text-blue-400 underline" href={item.url}
					>{item.documentTitle}</a
				>
			{:else}{item.value}{/if}
		</Typography>
	{/each}
</Container>
