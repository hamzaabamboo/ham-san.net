<script lang="ts">
	import Container from "@components/core/Container.svelte";
	import Divider from "@components/core/Divider.svelte";
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
	<Typography class="mb-4">{$t('note.description')}</Typography>
	{#each articles as item}
		<div class="block w-full p-2mb-4" >
			<a href="/notes/{item.urlId}"
				>
				<Typography variant="h5" class="font-bold">
					{item.documentTitle}
				</Typography>
			</a>
			<Divider />
		</div>
	{/each}
</Container>
