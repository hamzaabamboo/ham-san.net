<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import Divider from '@components/core/Divider.svelte';
	import MetaTags from '@components/core/MetaTags.svelte';
	import Typography from '@components/core/Typography.svelte';
	import { locale, t } from '@i18n';
	import { formatMonthYear } from '@utils/date';
	import { parseISO } from 'date-fns';
	import type { PageData } from './$types';

	export let data: PageData;

	$: articles = data.data ?? [];

	const getSubtitle = (note: (typeof articles)[number]) =>
		[
			note?.createdAt ? formatMonthYear(parseISO(note.createdAt), $locale) : null,
			note?.collectionName
		]
			.filter((f) => !!f)
			.join(' | ');
</script>

<MetaTags
	title="{$t('note.notes')} | {$t('common.name')}"
	description={$t('note.description')}
	path="notes"
/>

<Container class="pt-8">
	<Typography variant="h1" class="mb-2">{$t('note.notes')}</Typography>
	<Typography class="mb-4">{$t('note.description')}</Typography>
	{#each articles as item}
		<div class="block w-full py-1">
			<a href="/notes/{item.urlId}">
				<Typography variant="h5" class="mb-1 font-bold">
					{item.title}
				</Typography>
				<Typography variant="subtitle" class="mb-2">{getSubtitle(item)}</Typography>
				<Typography variant="body">{item.description}</Typography>
			</a>
			<Divider />
		</div>
	{/each}
</Container>
