<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import MetaTags from '@components/utils/MetaTags.svelte';
	import Typography from '@components/core/Typography.svelte';
	import BlogPostItem from '@components/blog/BlogPostItem.svelte';
	import { t } from '@i18n';
	import groupBy from 'lodash/groupBy';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: blogPosts = data.data;
</script>

<MetaTags title="{$t('blog.blog')} | {$t('common.name')}" path="blogs" />

<Container class="my-8">
	<Typography variant="h2" class="mb-4">{$t('blog.posts')}</Typography>
	<div class="flex flex-row">
		{#if blogPosts}
			{#if blogPosts.blogs?.data && blogPosts.blogs?.data.length > 0}
				{#each blogPosts.blogs?.data as blogPost}
					<BlogPostItem blogPost={blogPost.attributes} class="w-full" />
					<hr />
				{/each}
			{:else}
				Blog posts not found
			{/if}
		{/if}
	</div>
</Container>
