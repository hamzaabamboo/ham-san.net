<script lang="ts">
	import type { Project } from '@graphql/generated/client';
	import { getMediaUrl } from '@utils/media';
	import Typography from '@components/core/Typography.svelte';

	export let project: Pick<Project, 'title' | 'media' | 'description' | 'slug'>;

	let _class = '';
	export { _class as class };
</script>

<a class="p-2  {_class || ''}" href="/projects/{project.slug}" style:min-height="250px">
	<div
		class="bg-white shadow-md rounded-md flex flex-col h-full transtion-shadow transition-transform hover:shadow-lg hover:scale-105"
	>
		{#if project.media?.data[0]?.attributes?.url}
			<div
				class="bg-cover bg-center bg-no-repeat h-64 "
				style:background-image="url('{getMediaUrl(project.media?.data[0]?.attributes?.url)}')"
			/>
		{/if}
		<div class="w-full h-full flex-1 p-2 ">
			<Typography variant="h4">{project.title}</Typography>
			{#if project.description}
				<p>{project.description}</p>
			{/if}
		</div>
	</div>
</a>
