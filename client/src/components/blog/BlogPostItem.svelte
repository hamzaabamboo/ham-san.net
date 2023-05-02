<script lang="ts">
	import type { BlogPreviewFragment } from '@graphql/generated/client';
	import { getMediaUrl } from '@utils/media';
	import Typography from '@components/core/Typography.svelte';
	import { formatMonthYear, parseDate } from '@utils/date';
	import { locale, t } from '@i18n';
	import TagItem from '@components/tags/TagItem.svelte';
	import { sortTags } from '@utils/tags';

	export let blogPost: Pick<
		BlogPreviewFragment,
		'title' | 'thumbnail' | 'description' | 'slug' | 'createdAt' | 'tags' | 'category'
	>;

	let _class = '';
	// $: subtitle = [
	// 	project?.date ? formatMonthYear(parseDate(project?.date), $locale) : null,
	// 	project?.category?.data?.attributes?.name
	// ]
	// 	.filter((f) => !!f)
	// 	.join(' | ');

	export { _class as class };
</script>

<a href="/blog/{blogPost.slug}" class="flex md:min-h-[200px] {_class || ''}">
	<div class="w-full h-full flex-1 p-2">
		<Typography variant="h5" class="mb-1 text-bold">{blogPost.title}</Typography>
		<!-- {#if subtitle}<Typography variant="subtitle" class="mb-1">{subtitle}</Typography>{/if} -->
		{#if blogPost.tags?.data && blogPost.tags?.data?.length > 0}
			<div class="flex items-center flex-wrap">
				<Typography variant="subtitle" class="mr-2">{$t('common.tags')}:</Typography>
				{#each sortTags(blogPost?.tags?.data) as tag}
					{#if tag.attributes}
						<TagItem tag={tag?.attributes} class="mr-1 my-1" />
					{/if}
				{/each}
			</div>
		{/if}
		{#if blogPost.description}
			<p>{blogPost.description}</p>
		{/if}
	</div>
	{#if blogPost.thumbnail?.data?.attributes?.url}
		<div
			class="bg-cover bg-center bg-no-repeat min-w-[400px]"
			style:background-image="url('{getMediaUrl(blogPost.thumbnail?.data?.attributes?.url, {
				height: 400
			})}')"
		/>
	{/if}
</a>
