<script lang="ts">
	import type { GetProjectBySlugQuery } from '../../../graphql/generated/client';
	import MarkdownRenderer from '@components/markdown/MarkdownRenderer.svelte';
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import Pill from '@components/core/Pill.svelte';
	import { getMediaUrl } from '@utils/media';
	// import Carousel from 'svelte-carousel';
	import { t, locale } from '@i18n';
	import Fa from 'svelte-fa';
	import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
	import { parse, format } from 'date-fns';
	import { ja, enUS } from 'date-fns/locale';

	/** @type {import('./$types').PageData} */
	export let data: GetProjectBySlugQuery;

	const project = data.projects?.data[0].attributes;
	const title = project?.title;
	const content = project?.content;
	const banner = project?.banner?.data?.attributes?.url;
	const tags = project?.tags?.data;
	const links = project?.links;
	const media = project?.media?.data;

	$: formattedDate = project?.date
		? format(parse(project?.date, 'yyyy-MM-dd', new Date()), 'MMMM yyyy', {
				locale: $locale === 'ja' ? ja : enUS
		  })
		: null;
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
			<Typography class="font-sm font-gray-300"
				><a href="/projects"
					><Fa icon={faArrowLeft} class="inline mr-2" />{$t('project.back-to-projects')}
				</a></Typography
			>
		</div>
		<div class="mb-2">
			<Typography variant="title">{title}</Typography>
			{#if formattedDate}
				<Typography variant="subtitle">{formattedDate}</Typography>
			{/if}
		</div>
		{#if links && links?.length > 0}
			<div class="flex flex-col">
				{#each links as link}
					<div>
						<Typography>
							{link?.title}:
							<a target="_blank" rel="noreferrer" class="text-blue-400 underline" href={link?.url}
								>{link?.url}</a
							>
						</Typography>
					</div>
				{/each}
			</div>
		{/if}
		{#if tags && tags?.length > 0}
			<div class="flex items-center flex-wrap">
				<Typography variant="subtitle" class="mr-2">{$t('common.tags')}:</Typography>
				{#each tags as tag}
					<Pill class="bg-red-100 mr-2">{tag.attributes?.title}</Pill>
				{/each}
			</div>
		{/if}
	</div>
	{#if content}
		<div class="my-8"><MarkdownRenderer {content} /></div>
	{/if}
	<!-- {#if media && media.length > 0}
		<div>
			<Typography variant="h2" class="mb-4">{$t('project.screenshots')}</Typography>
			<Carousel>
				{#each media as image}
					<div class="w-1/3">
						<img
							src={getMediaUrl(image?.attributes?.url)}
							alt={image?.attributes?.name}
							class="max-h-64 mx-auto"
						/>
					</div>
				{/each}
			</Carousel>
		</div>
	{/if} -->
</Container>

<Container fluid class="bg-primary bg-opacity-10 h-64" />
