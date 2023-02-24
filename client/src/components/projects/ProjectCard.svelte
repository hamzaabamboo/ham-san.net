<script lang="ts">
	import type { Project } from '@graphql/generated/client';
	import { getMediaUrl } from '@utils/media';
	import Typography from '@components/core/Typography.svelte';

	export let project: Pick<Project, 'title' | 'media' | 'description' | 'slug'>;
</script>

<a class="sm:w-1/2 lg:w-1/3 p-2 " href="/projects/{project.slug}">
	<div class="rounded-md flex flex-col h-full">
		{#if project.media?.data[0]?.attributes?.url}
			<div
				class="bg-cover bg-no-repeat h-64 "
				style:background-image="url('{getMediaUrl(project.media?.data[0]?.attributes?.url)}')"
			/>
		{/if}
		<div class="bg-white shadow-md w-full h-full flex-1 p-2 ">
			<Typography variant="h4">{project.title}</Typography>
			{#if project.description}
				<p>{project.description}</p>
			{/if}
		</div>
	</div>
</a>
