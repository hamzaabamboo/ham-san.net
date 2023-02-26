<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Container from '@components/core/Container.svelte';
	import Pill from '@components/core/Pill.svelte';
	import Typography from '@components/core/Typography.svelte';
	import MarkdownRenderer from '@components/markdown/MarkdownRenderer.svelte';
	import TagItem from '@components/tags/TagItem.svelte';
	import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
	import { locale, t } from '@i18n';
	import { localizationUrls } from '@stores/localizationUrls';
	import { formatMonthYear } from '@utils/date';
	import { getMediaUrl } from '@utils/media';
	import { onDestroy } from 'svelte';
	import Carousel from 'svelte-carousel';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';

	export let data: PageData;

	$: project = data.data.projects?.data[0].attributes;
	$: title = project?.title;
	$: content = project?.content;
	$: banner = project?.banner?.data?.attributes?.url;
	$: tags = project?.tags?.data;
	$: links = project?.links;
	$: media = project?.media?.data;

	$: formattedDate = project?.date ? formatMonthYear(project?.date, $locale) : null;

	$: {
		const localizationObj = Object.fromEntries(
			project?.localizations?.data.map(({ attributes }) => [
				attributes?.locale,
				attributes?.slug
			]) ?? []
		);
		localizationUrls.set(localizationObj);
	}

	onDestroy(() => {
		localizationUrls.set({});
	});
</script>

<svelte:head>
	<title>{$t('common.name')} | {title}</title>
</svelte:head>

{#if banner}
	<div
		class="bg-cover bg-center"
		style:height="400px"
		style:background-image="url('{getMediaUrl(banner)}')"
		style:transform="translateZ(-2px) scale(1.8)"
	/>
{/if}
<Container fluid class="bg-white flex-1 w-full">
	<Container class="py-8">
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
						{#if tag.attributes} <TagItem tag={tag?.attributes} class="mr-2" /> {/if}
					{/each}
				</div>
			{/if}
		</div>
		{#if content}
			<div class="my-8"><MarkdownRenderer {content} /></div>
		{/if}
		{#if browser && media && media.length > 0}
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
		{/if}
	</Container>
</Container>
<Container fluid class="bg-primary bg-opacity-10 h-64" />
