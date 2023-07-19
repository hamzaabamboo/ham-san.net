<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_URL } from '$env/static/public';
	import Container from '@components/core/Container.svelte';
	import Divider from '@components/core/Divider.svelte';
	import MetaTags from '@components/core/MetaTags.svelte';
	import Typography from '@components/core/Typography.svelte';
	import MarkdownRenderer from '@components/markdown/MarkdownRenderer.svelte';
	import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
	import { locale, t } from '@i18n';
	import { localizationUrls } from '@stores/localizationUrls';
	import { cleanArticleContent } from '@utils/article';
	import { formatMonthYear } from '@utils/date';
	import { parseISO } from 'date-fns';
	import debounce from 'lodash/debounce';
	import { onDestroy } from 'svelte';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ data: articleData, childDocuments, collection, banner, description, outlineUrl} = data)
	$: note = articleData?.data;
	$: title = note?.title;
	$: content = cleanArticleContent(note?.text)

	const { params } = $page
	
	// $: console.log(content, note?.text)
	// $: tags = note.tags?.data;
	// $: category = note.category?.data?.attributes?.name;
	$: subtitle = [
		collection,
		note?.createdAt ? formatMonthYear(parseISO(note.createdAt), $locale) : null
	]
		.filter((f) => !!f)
		.join(' | ');
 
	let bannerWidth: number;
	let maxBannerWidth: number = 0;

	$: updateWidth = debounce((newWidth) => {
		maxBannerWidth = newWidth > maxBannerWidth ? newWidth : maxBannerWidth;
	}, 500);
	$: updateWidth(bannerWidth);

	onDestroy(() => {
		localizationUrls.set({});
	});
</script>



<MetaTags
	title="{title} | {$t('common.name')}"
	description={description ?? undefined}
	image={banner?.includes("http") ? banner : PUBLIC_URL + banner}
	path="notes/{params.slug}"
/>

<!-- {#if banner}
	<div
		class="bg-cover bg-center"
		bind:clientWidth={bannerWidth}
		style:height="400px"
		style:background-image="url('{getMediaUrl(banner, {
			height: 400,
			width: maxBannerWidth,
			fit: 'outside'
		})}')"
		style:transform="translateZ(-2px) scale(1.8)"
	/>
{/if} -->
<Container fluid class="bg-white flex-1 w-full py-2">
	<Container class="py-8">
		<div class="mb-8">
			<div class="mb-2">
				<Typography class="font-sm font-gray-300"
					><a href="/notes"
						><Fa icon={faArrowLeft} class="inline mr-2" />{$t('note.back-to-posts')}
					</a></Typography
				>
			</div>
			<div class="mb-2">
				<Typography variant="title">{title}</Typography>
				{#if subtitle || note?.url}<Typography variant="subtitle" as="span" class="mb-2">{subtitle}{#if note?.url}<a href="{outlineUrl}" target="__blank" ref="noreferer" class="ml-1">{$t('note.read-in-outline')}</a>{/if}</Typography>{/if}
			</div>
		</div>
		{#if content}
			<div class="my-8"><MarkdownRenderer {content} mediaRoot="" relativeUrlRoot='/notes/{params.slug}'/></div>
		{/if}
	</Container>
	<Divider />
	<Container>
		<ul>
			{#each childDocuments as document}
				<li><a href="/notes/{params.slug}{document.url}">{document.title}</a></li>
			{/each}
		</ul>
	</Container>
</Container>
<Container fluid class="bg-primary bg-opacity-10 h-64" />
