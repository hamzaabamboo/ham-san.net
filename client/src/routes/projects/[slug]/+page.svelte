<script lang="ts">
	import type { GetProjectBySlugQuery } from '../../../graphql/generated/client';
	import MarkdownRenderer from '@components/markdown/MarkdownRenderer.svelte';
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import Pill from '@components/core/Pill.svelte';
	import { getMediaUrl } from '@utils/media';
	import { t } from '@i18n';

	/** @type {import('./$types').PageData} */
	export let data: GetProjectBySlugQuery;

	const project = data.projects?.data[0].attributes;
	const title = project?.title;
	const content = project?.content;
	const banner = project?.banner?.data?.attributes?.url;
	const tags = project?.tags?.data;
	const links = project?.links;
</script>

{#if banner}
	<div
		class="h-64 bg-fixed bg-cover bg-center"
		style:background-image="url('{getMediaUrl(banner)}')"
	/>
{/if}
<Container class="py-8 flex-1 w-full">
	<div class="mb-8">
		<div class="mb-2">
			<Typography variant="title">{title}</Typography>
			{#if project?.date}
				<Typography variant="subtitle">{project?.date}</Typography>
			{/if}
		</div>
		{#if links && links?.length > 0}
			<div class="flex flex-col">
				{#each links as link}
					<div>
						<Typography>
							{link?.title}:
							<a target="_blank" class="text-blue-400 underline" href={link?.url}>{link?.url}</a>
						</Typography>
					</div>
				{/each}
			</div>
		{/if}
		{#if tags && tags?.length > 0}
			<div class="flex items-center">
				<Typography variant="subtitle" class="mr-2">{$t('tags')}:</Typography>
				{#each tags as tag}
					<Pill class="bg-red-100">{tag.attributes?.title}</Pill>
				{/each}
			</div>
		{/if}
	</div>
	<MarkdownRenderer {content} />
</Container>
<Container fluid class="bg-primary bg-opacity-10 h-64" />
