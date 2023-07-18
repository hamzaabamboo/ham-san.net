<script lang="ts">
	import Container from "@components/core/Container.svelte";
	import MetaTags from "@components/core/MetaTags.svelte";
	import Typography from "@components/core/Typography.svelte";
	import { t } from "@i18n";
	import type { PageData } from "./$types";

    export let data: PageData

	$: articles = data.data ?? [];
	// $: console.log(data.data); 
</script>

<MetaTags title="{$t('note.notes')} | {$t('common.name')}" path="notes" />

<Container class="pt-8">
	<Typography variant="h1" class="mb-2">{$t('note.notes')}</Typography>
	{#each articles as item}
		<Typography>
			{#if item.url}
				<a class="text-blue-400 underline" href="/notes/{item.urlId}"
					>{item.documentTitle}</a
				>
			{:else}{item.value}{/if}
		</Typography>
	{/each}
</Container>
